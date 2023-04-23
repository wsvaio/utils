import { merge } from "./merge";
import type { DeepPartial } from "./types";
// ios safair 浏览器中，必须将 input 添加到 真实的dom 中，onchange事件才会响应 在真实dom中，才会有 event.target
export const filePicker = (options: DeepPartial<HTMLInputElement>) => {
  const body = document.querySelector<HTMLBodyElement>("body")!;
  let input = document.querySelector<HTMLInputElement>("#wsvaio-utils-file-picker");
  if (input) body.removeChild(input);
  input = document.createElement("input");
  body.appendChild(input);
  merge(input, options, { deep: 3 });
  input.type = "file";
  input.id = "wsvaio-utils-file-picker";
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
