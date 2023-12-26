import { is } from "./is";

/**
 * 将对象转换为 FormData 对象。
 *
 * @param obj 要转换的对象。
 * @returns 转换后的 FormData 对象。
 */
export function objToFormData<T extends object>(obj: T) {
  const formData = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (is("Array")(v))
      v.forEach(item => formData.append(k, item as any));

    else formData.append(k, v);
  }
  return formData;
}
