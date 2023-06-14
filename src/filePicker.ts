import { merge } from "./merge";
import type { DeepPartial } from "./types";

// ios safair 浏览器中，必须将 input 添加到 真实的dom 中，onchange事件才会响应 在真实dom中，才会有 event.target
/**
 * 一个文件选择器函数，用于创建一个 input 元素并触发点击事件来打开文件选择器。
 * @param options 可选的 HTMLInputElement 属性对象。
 */
export const filePickerKey = "wsvaio-utils-file-picker";
export const filePicker = (options: DeepPartial<HTMLInputElement>) => {
	const body = document.querySelector<HTMLBodyElement>("body")!;
	let input = document.querySelector<HTMLInputElement>(`#${filePickerKey}`);
	if (input) body.removeChild(input);
	input = document.createElement("input");
	body.appendChild(input);
	merge(input, options, { deep: 3 });
	input.type = "file";
	input.id = filePickerKey;
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
