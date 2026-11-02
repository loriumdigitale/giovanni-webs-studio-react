#!/bin/sh
# Mezcla la voz "Bienvenido a Lorium" con el audio ambiente del intro (sirve para .webm y .mp4).
# Uso:  ./anadir_voz.sh lorium_intro_desktop.webm voz.mp3 salida.webm [inicio_ms]
#       ./anadir_voz.sh lorium_intro_mobile.mp4      voz.mp3 salida.mp4  [inicio_ms]
# La voz entra por defecto a los 4200 ms (cuando termina el trazo y aparece "Lorium").
# El ambiente baja de volumen automaticamente mientras habla la voz.
VIDEO="$1"; VOZ="$2"; OUT="$3"; MS="${4:-4200}"
[ -z "$OUT" ] && { echo "Uso: $0 video voz.mp3 salida [inicio_ms]"; exit 1; }
case "$OUT" in *.mp4) AC="-c:a aac -b:a 160k -movflags +faststart";; *) AC="-c:a libopus -b:a 128k";; esac
ffmpeg -y -loglevel error -i "$VIDEO" -i "$VOZ" -filter_complex \
"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=${MS}|${MS},asplit=2[v1][v2];\
[0:a][v1]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=500[duck];\
[duck][v2]amix=inputs=2:duration=first:normalize=0[a]" \
-map 0:v -map "[a]" -c:v copy $AC "$OUT" && echo "Listo: $OUT"
