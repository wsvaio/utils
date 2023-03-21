import { is } from "./is";

export const objToFormData = (obj: Record<any, any>) => {
  const formData = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (is("Array")(v))
      v.forEach(item => formData.append(k, item as any));

    else formData.append(k, v);
  }
  return formData;
};
