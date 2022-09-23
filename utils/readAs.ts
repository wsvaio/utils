export default <T = string | ArrayBuffer | null>(as: "ArrayBuffer" | "BinaryString" | "DataURL" | "Text", blob: Blob, encoding?: string) =>
  new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(<T>reader.result);
    reader.onerror = e => reject(e);
    reader[`readAs${as}`](blob, encoding);
  })

