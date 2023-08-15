/**
 * 获取类型T中所有属性的值的联合类型
 */
export type ValueOf<T> = T[keyof T];

/**
 * 将类型T中所有属性都变为可写属性
 */
export type Writeable<T> = {
	-readonly [K in keyof T]: T[K];
};

/**
 * 将类型T中所有属性都变为可选属性
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

// 变联合类型函数参数
export type ToUnionOfFunction<T> = T extends any ? (x: T) => any : never;
// 联合转交叉
export type UnionToIntersection<T> = ToUnionOfFunction<T> extends (x: infer P) => any ? P : never;
