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
export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};
