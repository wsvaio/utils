import merge from "./merge";
export default (options: Partial<HTMLInputElement>) => {
  const body = document.querySelector("body");
  const input = document.createElement("input");
  
  body?.appendChild(input);
  input.type = "file";
  merge(input, options);
  input.click();
  body?.removeChild(input);

};

// ios safair 浏览器中，必须将 input 添加到 真实的dom 中，onchange事件才会响应 在真实dom中，才会有 event.target
export const filePicker = (options: Partial<HTMLInputElement>) => {
  const body = document.querySelector("body");
  let input = document.querySelector<HTMLInputElement>("#filePickerInput");
  if (input) body?.removeChild(input);
  input = document.createElement("input");
  input.type = "file";
  input.id = "filePickerInput";
  input.style.display = "none";
  body?.appendChild(input);
  merge(input, options);
  input.click();
};

