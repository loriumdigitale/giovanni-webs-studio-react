#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const token = process.argv[i];
  if (!token.startsWith('--')) continue;
  const key = token.slice(2);
  const next = process.argv[i + 1];
  if (next && !next.startsWith('--')) {
    args[key] = next;
    i += 1;
  } else {
    args[key] = true;
  }
}

const options = {
  url: args.url ?? 'http://127.0.0.1:4174/',
  cdp: args.cdp ?? 'http://127.0.0.1:9222',
  width: Number(args.width ?? 360),
  height: Number(args.height ?? 800),
  deviceScale: Number(args['device-scale'] ?? 2),
  cpuRate: Number(args['cpu-rate'] ?? 6),
  baselineMs: Number(args['baseline-ms'] ?? 12500),
  stressMs: Number(args['stress-ms'] ?? 15000),
  expectedMediumDpr: Number(args['expected-medium-dpr'] ?? 0.75),
  outputDir: path.resolve(args['output-dir'] ?? '/tmp/laserflow-perf'),
};

const targetEndpoint = options.cdp.replace(/\/$/, '');
const target = await fetch(`${targetEndpoint}/json/new?about:blank`, { method: 'PUT' }).then(async (response) => {
  if (!response.ok) throw new Error(`No se pudo crear una pestaña CDP: HTTP ${response.status}`);
  return response.json();
});
const ws = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;

await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message));
  else waiter.resolve(message.result);
});

function cdp(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
    const timeout = setTimeout(() => {
      if (!pending.has(id)) return;
      pending.delete(id);
      reject(new Error(`CDP timeout: ${method}`));
    }, 60000);
    timeout.unref?.();
  });
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function evaluate(expression) {
  const response = await cdp('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text || 'Falló la evaluación en la página');
  }
  return response.result?.value;
}

async function getLaserState() {
  return evaluate(`(() => {
    const wrapper = document.querySelector('.lorium-cards__laser-flow');
    const canvas = wrapper?.querySelector('canvas');
    let renderer = null;
    if (canvas) {
      const gl = canvas.getContext('webgl2');
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : (gl ? 'WebGL2 (renderer hidden)' : null);
    }
    return {
      ready: document.readyState,
      globalProfile: wrapper?.dataset.perfilClasificado ?? null,
      laserProfile: wrapper?.dataset.perfilLaser ?? null,
      canvas: canvas ? {
        width: canvas.width,
        height: canvas.height,
        cssWidth: canvas.clientWidth,
        cssHeight: canvas.clientHeight,
        internalScaleX: canvas.clientWidth ? canvas.width / canvas.clientWidth : null,
        internalScaleY: canvas.clientHeight ? canvas.height / canvas.clientHeight : null,
      } : null,
      renderer,
      hardwareConcurrency: navigator.hardwareConcurrency,
      devicePixelRatio,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      uniforms: window.__laserTestUniforms ?? {},
    };
  })()`);
}

async function measure(durationMs) {
  return evaluate(`new Promise((resolve) => {
    const start = performance.now();
    let last = null;
    let bucketStart = start;
    let bucket = [];
    const all = [];
    const samples = [];
    function tick(now) {
      if (last !== null) {
        const delta = now - last;
        all.push(delta);
        bucket.push(delta);
      }
      last = now;
      if (now - bucketStart >= 1000) {
        const wrapper = document.querySelector('.lorium-cards__laser-flow');
        samples.push({
          t: Math.round(now - start),
          fps: Math.round(bucket.length * 1000 / (now - bucketStart) * 10) / 10,
          latePct: Math.round(bucket.filter((d) => d > 33).length / Math.max(1, bucket.length) * 100),
          profile: wrapper?.dataset.perfilLaser ?? null,
        });
        bucketStart = now;
        bucket = [];
      }
      if (now - start < ${durationMs}) requestAnimationFrame(tick);
      else {
        const sorted = [...all].sort((a, b) => a - b);
        const avgDelta = all.reduce((sum, delta) => sum + delta, 0) / Math.max(1, all.length);
        const wrapper = document.querySelector('.lorium-cards__laser-flow');
        const canvas = wrapper?.querySelector('canvas');
        resolve({
          elapsedMs: Math.round(now - start),
          avgFps: Math.round(1000 / avgDelta * 10) / 10,
          p95FrameMs: Math.round((sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))] || 0) * 10) / 10,
          lateFramePct: Math.round(all.filter((delta) => delta > 33).length / Math.max(1, all.length) * 1000) / 10,
          samples,
          laserProfile: wrapper?.dataset.perfilLaser ?? null,
          globalProfile: wrapper?.dataset.perfilClasificado ?? null,
          canvas: canvas ? {
            width: canvas.width,
            height: canvas.height,
            cssWidth: canvas.clientWidth,
            cssHeight: canvas.clientHeight,
            internalScaleX: canvas.clientWidth ? canvas.width / canvas.clientWidth : null,
            internalScaleY: canvas.clientHeight ? canvas.height / canvas.clientHeight : null,
          } : null,
          uniforms: window.__laserTestUniforms ?? {},
        });
      }
    }
    requestAnimationFrame(tick);
  })`);
}

async function saveScreenshot(filename) {
  const screenshot = await cdp('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  const file = path.join(options.outputDir, filename);
  await fs.writeFile(file, Buffer.from(screenshot.data, 'base64'));
  return file;
}

await fs.mkdir(options.outputDir, { recursive: true });
let hardwareConcurrencyOverride = false;
try {
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride', {
    width: options.width,
    height: options.height,
    deviceScaleFactor: options.deviceScale,
    mobile: true,
    screenWidth: options.width,
    screenHeight: options.height,
    screenOrientation: { angle: 0, type: 'portraitPrimary' },
  });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await cdp('Emulation.setCPUThrottlingRate', { rate: 1 });
  try {
    await cdp('Emulation.setHardwareConcurrencyOverride', { hardwareConcurrency: 4 });
    hardwareConcurrencyOverride = true;
  } catch {}
  await cdp('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      window.__laserTestUniforms = {};
      if (!window.WebGL2RenderingContext) return;
      const proto = WebGL2RenderingContext.prototype;
      const names = new WeakMap();
      const originalGetUniformLocation = proto.getUniformLocation;
      proto.getUniformLocation = function(program, name) {
        const location = originalGetUniformLocation.call(this, program, name);
        if (location) names.set(location, name);
        return location;
      };
      const originalUniform1f = proto.uniform1f;
      proto.uniform1f = function(location, value) {
        if (names.get(location) === 'uDpr') window.__laserTestUniforms.uDpr = value;
        return originalUniform1f.call(this, location, value);
      };
      const originalUniform4f = proto.uniform4f;
      proto.uniform4f = function(location, a, b, c, d) {
        const name = names.get(location);
        if (name === 'uAmount' || name === 'uShape') {
          window.__laserTestUniforms[name] = [a, b, c, d];
        }
        return originalUniform4f.call(this, location, a, b, c, d);
      };
    })();`,
  });
  await cdp('Page.navigate', { url: options.url });
  await pause(2200);

  const position = await evaluate(`(() => {
    const section = document.querySelector('.lorium-cards');
    if (!section) return null;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - window.innerHeight + 250));
    return { scrollY: window.scrollY, height: window.innerHeight };
  })()`);
  if (!position) throw new Error('No se encontró .lorium-cards en la URL indicada.');
  await pause(1500);
  const initial = await getLaserState();
  if (!initial.canvas) throw new Error('LaserFlow no montó un canvas WebGL2 en el viewport de prueba.');

  const baseline = await measure(options.baselineMs);
  const baselineScreenshot = await saveScreenshot('baseline.png');

  await cdp('Emulation.setCPUThrottlingRate', { rate: options.cpuRate });
  let stress = await measure(options.stressMs);
  let cpuRateUsed = options.cpuRate;
  if (stress.laserProfile === 'high') {
    const fallbackRate = Math.max(20, options.cpuRate * 2);
    await cdp('Emulation.setCPUThrottlingRate', { rate: fallbackRate });
    stress = await measure(options.stressMs);
    cpuRateUsed = fallbackRate;
  }
  const stressScreenshot = await saveScreenshot('stressed.png');

  const beforeMedium = stress.samples.filter((sample) => sample.profile === 'high');
  const afterMedium = stress.samples.filter((sample) => sample.profile === 'medium');
  const mean = (samples) => samples.length
    ? Math.round(samples.reduce((sum, sample) => sum + sample.fps, 0) / samples.length * 10) / 10
    : null;
  const beforeOptics = baseline.uniforms;
  const afterOptics = stress.uniforms;
  const opticalUniformsUnchanged = JSON.stringify({ uAmount: beforeOptics.uAmount, uShape: beforeOptics.uShape })
    === JSON.stringify({ uAmount: afterOptics.uAmount, uShape: afterOptics.uShape });
  const observedDpr = stress.uniforms.uDpr ?? stress.canvas?.internalScaleX ?? null;

  const result = {
    simulation: {
      url: options.url,
      viewportCssPx: `${options.width}x${options.height}`,
      deviceScaleFactor: options.deviceScale,
      cpuThrottleRateUsed: cpuRateUsed,
      hardwareConcurrencyOverride,
      graphics: 'Chromium WebGL2 / software renderer when launched with SwiftShader',
    },
    initial,
    baseline,
    stress,
    analysis: {
      meanFpsBeforeMedium: mean(beforeMedium),
      meanFpsAfterMedium: mean(afterMedium),
      mediumActivated: stress.laserProfile === 'medium',
      expectedMediumDpr: options.expectedMediumDpr,
      observedMediumDpr: observedDpr,
      mediumDprMatchesExpected: stress.laserProfile === 'medium'
        && Math.abs((observedDpr ?? -1) - options.expectedMediumDpr) < 0.03,
      opticalUniformsUnchanged,
    },
    screenshots: { baseline: baselineScreenshot, stressed: stressScreenshot },
  };
  const reportFile = path.join(options.outputDir, 'result.json');
  await fs.writeFile(reportFile, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ ...result, reportFile }, null, 2));
} finally {
  try { await cdp('Target.closeTarget', { targetId: target.id }); } catch {}
  ws.close();
}
