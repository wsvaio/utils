import { readAs } from "./readAs";

const dataURLToImage = (dataURL: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = e => reject(e);
  img.src = dataURL;
});
const canvasToFile = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob(blob =>
    blob ? resolve(blob) : reject(new Error("canvas.toBlob callback return is undefined")), type, quality));

/**
 * 图片压缩方法
 * @param file 图片文件
 * @param quality 压缩质量参数
 * @param width 最大宽度
 * @param height 最大高度
 * @returns 压缩后的File
 */
export const compressPicture = async (file: File, { quality = 0.5, width = 1920, height = 1080 } = {}) => {
  const { name, lastModified, type } = file;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const base64 = await readAs<string>("DataURL", file);
  const img = await dataURLToImage(base64);

  if (img.width > width) {
    img.height *= (width / img.width);
    img.width = width;
  }
  if (img.height > height) {
    img.width *= (height / img.height);
    img.height = height;
  }

  canvas.width = img.width;
  canvas.height = img.height;
  context.clearRect(0, 0, img.width, img.height);
  context.drawImage(img, 0, 0, img.width, img.height);
  const blob = await canvasToFile(canvas, type, quality); // quality:0.5可根据实际情况计算
  return new File([blob], name, { type, lastModified });
};
