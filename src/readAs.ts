/**
 * 读取 Blob 对象并将其转换为指定格式的数据。
 *
 * @param as 要转换的数据格式。
 * @param blob 要读取的数据源 Blob 对象。
 * @param encoding 仅适用于文本格式。指定编码以将二进制数据转换为文本数据。
 * @returns 返回一个 Promise，该 Promise 将解析为转换后的数据。
 */
export const readAs = <T = string | ArrayBuffer | null>(
	as: "ArrayBuffer" | "BinaryString" | "DataURL" | "Text",
	blob: Blob,
	encoding?: string
) =>
	new Promise<T>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(<T>reader.result);
		reader.onerror = e => reject(e);
		reader[`readAs${as}`](blob, encoding);
	});
