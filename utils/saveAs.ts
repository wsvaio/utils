export default async (data: string | Blob, name?: string) => {
  
  if (typeof data == "string") {
    name = data.split("/").reverse()[0];
    const response = await fetch(data);
    if (!response.ok) return Promise.reject(response);
    data = await response.blob();
  }

  const a = document.createElement("a");
  a.rel = "noopener";
  a.download = name || "download";
  a.href = URL.createObjectURL(data);
  a.click();
  URL.revokeObjectURL(a.href);
};