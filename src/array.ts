/**
 * 遍历数组
 * @param array - 要遍历的数组或对象树。
 * @param handle - 对每个元素执行的操作函数。
 * @param options - 可选参数对象，包含以下属性：
 *   - deep - 遍历的深度，默认为 1。
 *   - childrenKey - 对象树中子元素的键名，默认为 "children"。
 *   - mode - 遍历模式，支持深度优先搜索（"DFS"）和广度优先搜索（"BFS"），默认为 "DFS"。
 */
export const ergodic = <T>(
	array: T[],
	handle: (item: T) => void,
	options?: {
		deep?: number;
		childrenKey?: string;
		mode?: "DFS" | "BFS";
	}
) => {
	let { childrenKey = "children", mode = "DFS", deep = 1 } = options || {};
	deep--;

	const childrens: T[] = [];

	for (const item of array) {
		handle(item);
		if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0 && deep > 0) {
			mode == "DFS"
				? ergodic(item[childrenKey], handle, { childrenKey, mode, deep })
				: childrens.push(...item[childrenKey]);
		}
	}
	mode == "BFS" && ergodic(childrens, handle, { childrenKey, mode, deep });
};
/**
 * 递归遍历映射数组
 * @param list - 要遍历的数组或对象树。
 * @param handle - 对每个元素执行的操作函数。
 * @returns 一个新的数组或对象树。
 */
export const map = <T extends { children?: T[] }, R extends { children?: R[] }>(
	list: T[],
	handle: (item: T) => Omit<R, "children"> & { children?: T[] }
) => {
	const result = [] as R[];
	for (const item of list) {
		const handled = handle(item);
		if (Array.isArray(handled?.children) || Array.isArray(item?.children))
			// @ts-expect-error pass
			handled.children = map(handled.children || item?.children, handle);
		result.push(handled as unknown as R);
	}
	return result;
};

/**
 * 遍历查找
 * @param list - 要查找的数组或对象树。
 * @param handle - 判断每个元素是否符合条件的操作函数。
 * @param options - 可选参数对象，包含以下属性：
 *   - deep - 遍历的深度，默认为 1。
 *   - childrenKey - 对象树中子元素的键名，默认为 "children"。
 *   - mode - 遍历模式，支持深度优先搜索（"DFS"）和广度优先搜索（"BFS"），默认为 "DFS"。
 * @returns 符合条件的元素，如果未找到，则返回 undefined。
 */
export const find = <T>(
	list: T[],
	handle: (item: T) => unknown,
	options?: {
		deep?: number;
		childrenKey?: string;
		mode?: "DFS" | "BFS";
	}
): T | undefined => {
	let { childrenKey = "children", mode = "DFS", deep = 1 } = options || {};
	deep--;
	const childrens: T[] = [];
	for (const item of list) {
		if (handle(item)) return item;
		if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0 && deep > 0) {
			if (mode == "DFS") {
				const finded = find(item[childrenKey] || [], handle, { childrenKey, mode, deep });
				if (finded) return finded;
			}
			else {
				childrens.push(...item[childrenKey]);
			}
		}
	}
	mode == "BFS" && find(childrens, handle, { childrenKey, mode, deep });
};

/**
 * 将数组转换为树形结构
 * @param array 待转换的数组
 * @param id 父节点id
 * @param options 配置项
 * @returns 树形结构
 */
export const arrayToTree = <T extends object, C extends string = "children">(
	array: T[],
	id?: string | number | symbol | null,
	options = {} as { idKey?: string; pidKey?: string; childrenKey?: C }
): T | undefined => {
	const { idKey = "id", pidKey = "pid", childrenKey = "children" } = options;
	type Trees = (T & { [K in C]: Trees })[];
	const trees: Trees = [];
	for (const item of array) {
		if (item[pidKey] == id)
			// @ts-expect-error pass
			trees.push({ ...item, [childrenKey]: arrayToTree(array, item[idKey], { idKey, pidKey }) });
	}
	return trees[0];
};
/**
 * 将树形结构转换为扁平化数组
 * @param tree 树形结构
 * @param array 扁平化数组
 * @param options 配置项
 * @returns 扁平化数组
 */
export function treeToArray<T>(
	tree: T,
	array = [] as T[],
	options = {} as { childrenKey?: string; delChidlrenKey?: boolean }
) {
	const { childrenKey = "children", delChidlrenKey = false } = options;
	array.push(tree);
	if (Array.isArray(tree[childrenKey]) && tree[childrenKey]?.length) {
		for (const item of tree[childrenKey]) treeToArray(item, array, { childrenKey, delChidlrenKey });
		delChidlrenKey && delete tree[childrenKey];
	}
	return array;
}
