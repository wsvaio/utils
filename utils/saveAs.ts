export default async (url: string, name?: string) => {
  const response = await fetch(url);
  if (!response.ok) return Promise.reject(response);
  const data = await response.blob();
  const a = document.createElement("a");
  a.rel = "noopener";
  a.download = name || url.split("/").reverse()[0] || "download";
  a.href = URL.createObjectURL(data);
  a.click();
  URL.revokeObjectURL(a.href);
};