import { merge } from "./merge";
// ios safair 浏览器中，必须将 input 添加到 真实的dom 中，onchange事件才会响应 在真实dom中，才会有 event.target

export const filePicker = (options: Partial<HTMLInputElement>) => {
  const body = document.querySelector<HTMLBodyElement>("body")!;
  let input = document.querySelector<HTMLInputElement>("#filePickerInput");
  if (input) body.removeChild(input);
  input = document.createElement("input");
  body.appendChild(input);
  merge(input, options);
  input.type = "file";
  input.id = "filePickerInput";
  input.style.cssText = `
    position: absolute;
    visibility: hidden;
    z-index: -999;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
  `;
  input.click();
};
