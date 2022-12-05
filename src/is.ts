import { toRawType } from "./to";

export const is = (...types: string[]) => (value: unknown) => types.includes(toRawType(value));


