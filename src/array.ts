/**
 * 遍历数组
 * @param array - 要遍历的数组或对象树。
 * @param handle - 对每个元素执行的操作函数。
 * @param options - 可选参数对象，包含以下属性：
 * @param options.deep - 遍历的深度，默认为 1。
 * @param options.childrenKey - 对象树中子元素的键名，默认为 "children"。
 * @param options.mode - 遍历模式，支持深度优先搜索（"DFS"）和广度优先搜索（"BFS"），默认为 "DFS"。
 */
export function ergodic<T>(
  array: T[],
  handle: (item: T) => void,
  options?: {
    deep?: number;
    childrenKey?: string;
    mode?: "DFS" | "BFS";
  }
) {
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
}

/**
 * 递归遍历映射数组
 * @param list - 要遍历的数组或对象树。
 * @param handle - 对每个元素执行的操作函数。
 * @returns 一个新的数组或对象树。
 */
export function map<T extends Record<any, any>, R extends Record<any, any>>(
  list: T[],
  handle: (item: T) => R,
  { childrenKey } = { childrenKey: "children" }
) {
  if (!list?.length)
    return [];
  const result = [] as R[];
  for (const item of list) {
    const handled = handle(item);
    if (Array.isArray(handled?.[childrenKey]) || Array.isArray(item?.[childrenKey]))
      // @ts-expect-error pass
      handled[childrenKey] = map(handled?.[childrenKey] || item?.[childrenKey], handle, { childrenKey });
    result.push(handled as unknown as R);
  }
  return result;
}

/**
 * 遍历查找
 * @param list - 要查找的数组或对象树。
 * @param handle - 判断每个元素是否符合条件的操作函数。
 * @param options - 可选参数对象，包含以下属性：
 * @param options.childrenKey - 对象树中子元素的键名，默认为 "children"。
 * @returns 符合条件的元素，如果未找到，则返回 undefined。
 */
export function find<T>(
  list: T[],
  handle: (item: T) => unknown,
  options?: {
    childrenKey?: string;
  }
): T | undefined {
  const { childrenKey = "children" } = options || {};
  for (const item of list) {
    if (handle(item))
      return item;
    if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
      const finded = find(item[childrenKey] || [], handle, { childrenKey });
      if (finded)
        return finded;
    }
  }
}

/**
 * 将数组转换为树形结构
 * @param array 待转换的数组
 * @param id 父节点id
 * @param options 配置项
 * @returns 树形结构
 */
export function arrayToTree<T extends object, C extends string = "children">(
  array: T[],
  id?: string | number | symbol | null,
  options = {} as { idKey?: string; pidKey?: string; childrenKey?: C }
): T[] | undefined {
  const { idKey = "id", pidKey = "pid", childrenKey = "children" } = options;
  type Trees = (T & { [K in C]: Trees })[];
  const trees: Trees = [];
  for (const item of array) {
    if (item[pidKey] == id)
      // @ts-expect-error pass
      trees.push({ ...item, [childrenKey]: arrayToTree(array, item[idKey], { idKey, pidKey, childrenKey }) });
  }
  return trees;
}

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
