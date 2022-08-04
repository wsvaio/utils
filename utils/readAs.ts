export default (as: "ArrayBuffer" | "BinaryString" | "DataURL" | "Text", blob: Blob, encoding?: string) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader[`readAs${as}`](blob, encoding);
  reader.onload = e => resolve(e);
  reader.onerror = e => reject(e);
})