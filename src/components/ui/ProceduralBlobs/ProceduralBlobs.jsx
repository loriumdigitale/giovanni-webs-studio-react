const blobs = [
	{ id: "blob-1", color: "secondary", top: "4%", left: "-6%", size: 150, blur: 72 },
	{ id: "blob-2", color: "tertiary", top: "20%", left: "82%", size: 170, blur: 82 },
	{ id: "blob-3", color: "secondary", top: "37%", left: "-8%", size: 130, blur: 68 },
	{ id: "blob-4", color: "tertiary", top: "54%", left: "86%", size: 155, blur: 76 },
	{ id: "blob-5", color: "secondary", top: "72%", left: "-7%", size: 140, blur: 70 },
	{ id: "blob-6", color: "tertiary", top: "89%", left: "80%", size: 165, blur: 80 },
];

export function ProceduralBlobs() {
	return (
		<div className="procedural-blobs" aria-hidden="true">
			{blobs.map((blob) => (
				<span
					key={blob.id}
					className="procedural-blobs__blob"
					style={{
						"--blob-color": `var(--color-${blob.color})`,
						"--blob-top": blob.top,
						"--blob-left": blob.left,
						"--blob-size": `${blob.size}px`,
						"--blob-blur": `${blob.blur}px`,
					}}
				/>
			))}
		</div>
	);
}
