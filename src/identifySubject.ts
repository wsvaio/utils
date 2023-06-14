/**
 * 识别给定图像的主题颜色，返回 RGBA 值的平均值。
 *
 * @param imgUrl 要识别的图像的 URL。
 * @returns 包含 RGBA 值平均值的数组，顺序为 [R, G, B, A]。
 */
export async function identifySubject(imgUrl: string): Promise<[number, number, number, number]> {
	const blob = await fetch(imgUrl, { cache: "no-cache" }).then(data => data.blob());
	const src = URL.createObjectURL(blob);
	return new Promise(resolve => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;
		const img = new Image();
		img.onload = () => {
			canvas.width = img.height;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const { data } = ctx.getImageData(0, 0, img.width, img.height);
			const rgbas: [number, number, number, number][] = [];
			for (let i = 0; i < data.length; i += 4)
				rgbas.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
			const result: [number, number, number, number] = [0, 0, 0, 0];
			for (const [r, g, b, a] of rgbas) {
				result[0] += r;
				result[1] += g;
				result[2] += b;
				result[3] += a;
			}
			result[0] /= rgbas.length;
			result[1] /= rgbas.length;
			result[2] /= rgbas.length;
			result[3] = result[3] / rgbas.length / 255;
			resolve(result);
		};
		img.onended = () => URL.revokeObjectURL(src);
		img.src = src;
	});
}
