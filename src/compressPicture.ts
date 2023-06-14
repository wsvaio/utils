import { readAs } from "./readAs";

/**
 * 将 data URL 转换为 HTMLImageElement
 * @param dataURL data URL 字符串
 * @returns HTMLImageElement 对象
 */
const dataURLToImage = (dataURL: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = e => reject(e);
		img.src = dataURL;
	});

/**
 * 将 canvas 转换为 Blob
 * @param canvas HTMLCanvasElement 对象
 * @param type Blob 类型
 * @param quality 图片压缩质量参数
 * @returns Blob 对象
 */
const canvasToFile = (canvas: HTMLCanvasElement, type: string, quality: number) =>
	new Promise<Blob>((resolve, reject) =>
		canvas.toBlob(
			blob => (blob ? resolve(blob) : reject(new Error("canvas.toBlob callback return is undefined"))),
			type,
			quality
		)
	);

/**
 * 图片压缩方法
 * @param file 图片文件
 * @param options 压缩选项
 * @param options.quality 压缩质量参数，默认为 0.5
 * @param options.width 最大宽度，默认为 1920
 * @param options.height 最大高度，默认为 1080
 * @returns 压缩后的 File 对象
 */
export const compressPicture = async (file: File, { quality = 0.5, width = 1920, height = 1080 } = {}) => {
	// 解构出文件的 name、lastModified 和 type 属性
	const { name, lastModified, type } = file;
	// 创建一个 canvas 和 context
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d")!;
	// 将文件转换为 base64 格式的字符串
	const base64 = await readAs<string>("DataURL", file);
	// 将 base64 字符串转换为 HTMLImageElement
	const img = await dataURLToImage(base64);

	// 如果图片宽度大于最大宽度，则按比例缩小
	if (img.width > width) {
		img.height *= width / img.width;
		img.width = width;
	}
	// 如果图片高度大于最大高度，则按比例缩小
	if (img.height > height) {
		img.width *= height / img.height;
		img.height = height;
	}

	// 设置 canvas 的宽度和高度
	canvas.width = img.width;
	canvas.height = img.height;
	// 清空 canvas
	context.clearRect(0, 0, img.width, img.height);
	// 在 canvas 上绘制图像
	context.drawImage(img, 0, 0, img.width, img.height);
	// 将 canvas 转换为 Blob
	const blob = await canvasToFile(canvas, type, quality); // quality:0.5可根据实际情况计算
	// 创建一个新的 File 对象，并返回
	return new File([blob], name, { type, lastModified });
};
