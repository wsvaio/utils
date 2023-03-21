import { toRawType } from "./to";

// export const is =
//   (...types: string[]) =>
//   (value: unknown) =>
//     types.includes(toRawType(value));

/**
 * 基本数据类型和一些常用的内置对象
 */
export interface BuiltInObjects {
  String: string;
  Number: number;
  Null: null;
  Undefined: undefined;
  Symbol: Symbol;
  BigInt: BigInt;
  Boolean: boolean;
  Object: Object;
  Function: Function;
  Error: Error;
  Date: Date;
  RegExp: RegExp;
  Map: Map<unknown, unknown>;
  Set: Set<unknown>;
  WeakMap: WeakMap<Object, unknown>;
  WeakSet: WeakSet<Object>;
  ArrayBuffer: ArrayBuffer;
  Promise: Promise<unknown>;
  Array: Array<unknown>;
}
/**
 * 判断数据类型
 */
export const is
  = <T extends keyof BuiltInObjects>(...types: T[]) =>
    (value: unknown): value is BuiltInObjects[T] =>
      types.includes(toRawType(value));
