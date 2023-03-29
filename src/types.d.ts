export type ValueOf<T> = T[keyof T];

export type Writeable<T> = {
  -readonly [K in keyof T]: T[K];
};
