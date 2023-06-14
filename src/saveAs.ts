import { to } from "./to";

/**
 * 如果提供了数据字符串，则会尝试将其作为 URL 进行下载。
 * 如果提供了 Blob，则会将其作为文件进行下载。
 *
 * @param data 要下载的数据字符串或 Blob。
 * @param name 下载的文件名。如果未提供，则将使用 URL 中的文件名。
 */
export const saveAs = async (data: string | Blob, name?: string) => {
	const a = document.createElement("a");
	a.rel = "noopener";
	if (typeof data == "string") {
		a.download = name || data.split("/").reverse()[0] || "download";
		const [err, res] = await to(fetch(data));
		if (err || !res?.ok) {
			a.href = data;
			a.click();
			return;
		}
		data = await res.blob();
	}
	a.download = name || "download";
	a.href = URL.createObjectURL(data);
	a.click();
	URL.revokeObjectURL(a.href);
};
/**
 * 一个实用函数，用于在浏览器中下载文件。
 *
 * @param url 要下载的文件的 URL。
 * @param name 下载的文件名。如果未提供，则将使用 URL 中的文件名。
 */
export const download = (url: string, name?: string) => {
	const a = document.createElement("a");
	a.rel = "noopener";
	a.download = name || url.split("/").reverse()[0];
	a.href = url;
	a.click();
};
