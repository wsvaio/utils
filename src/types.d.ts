export type ValueOf<T> = T[keyof T];

export type Writeable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};