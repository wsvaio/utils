/**
 * 递归遍历
 */
export const ergodic = <T>(
	array: T[],
	handle: (e: T) => void,
	options?: {
		childrenKey?: string;
		mode?: "DFS" | "BFS";
	}
) => {
	const { childrenKey = "children", mode = "DFS" } = options || {};
	const childrens: T[] = [];
	for (const item of array) {
		handle(item);
		Array.isArray(item[childrenKey])
			&& (mode == "DFS"
				? ergodic(item[childrenKey], handle, { childrenKey, mode })
				: childrens.push(...item[childrenKey]));
	}
	mode == "BFS" && ergodic(childrens, handle, { childrenKey, mode });
};
