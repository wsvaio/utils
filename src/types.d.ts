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

/**
 * 变联合类型函数参数
 */
export type ToUnionOfFunction<T> = T extends any ? (x: T) => any : never;
/**
 * 联合转交叉
 */
export type UnionToIntersection<T> = ToUnionOfFunction<T> extends (x: infer P) => any ? P : never;


/**
 * 判断两个类型是否相等
 */
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * 判断属性是否可选
 */
type IsOptional<O, K extends keyof O> = Partial<Pick<O, K>> extends Pick<O, K> ? true : false;
