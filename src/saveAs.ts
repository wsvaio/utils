import { to } from "./to";
export const saveAs = async (data: string | Blob, name?: string) => {
  const a = document.createElement("a");
  a.rel = "noopener";
  if (typeof data == "string") {
    a.download = name ?? data.split("/").reverse()[0] ?? "download";
    const [err, res] = await to(fetch(data));
    if (err || !res?.ok) {
      a.href = data;
      a.click();
      return;
    }
    data = await res.blob();
  }
  a.download = name ?? "download";
  a.href = URL.createObjectURL(data);
  a.click();
  URL.revokeObjectURL(a.href);
};

export const download = (url: string, name?: string) => {
  const a = document.createElement("a");
  a.rel = "noopener";
  a.download = name ?? url.split("/").reverse()[0];
  a.href = url;
  a.click();
}