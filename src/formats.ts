/**
 * 将给定的秒数格式化为指定的时间格式字符串。
 *
 * @param seconds 要格式化的秒数。
 * @param format 时间格式字符串，例如 "HH:mm:ss"。
 * @returns 格式化后的时间字符串。
 */
export const timeFormat = (seconds = 0, format = "HH:mm:ss") => {
	const o = { h: 0, m: 0, s: 0, H: 0, M: 0, S: 0 };

	let time = (o.S = Math.floor(seconds || 0));
	o.s = time % 60;

	time = o.M = (time - o.s) / 60;
	o.m = time % 60;

	time = o.H = (time - o.m) / 60;
	o.h = time % 60;

	format = format.split("").reverse().join("");
	for (const k of ["h", "m", "s", "H", "M", "S"]) {
		const v = String(o[k]).split("").reverse().join("");
		format = format.replace(new RegExp(`${k}{1,${v.length}}`), v).replace(new RegExp(`${k}`, "g"), "0");
	}
	return format.split("").reverse().join("");
};

/**
 * 将给定的日期格式化为指定的日期格式字符串。
 *
 * @param date 要格式化的日期。可以是字符串、日期对象或时间戳。
 * @param format 日期格式字符串，例如 "yyyy/MM/dd HH:mm:ss"。
 * @returns 格式化后的日期字符串。
 */
export const dateFormat = (date: string | Date | number | null | undefined, format = "yyyy/MM/dd HH:mm:ss") => {
	date || (date = Date.now());
	if (typeof date == "string") date = date.replace(/-/g, "/").replace("T", " ").replace("Z", " ");
	date = new Date(date);
	const o = {
		Y: date.getFullYear(),
		y: date.getFullYear(),
		M: date.getMonth() + 1,
		d: date.getDate(),
		H: date.getHours(),
		m: date.getMinutes(),
		s: date.getSeconds(),
		S: date.getMilliseconds(),
		w: date.getDay(),
	};
	format = format.split("").reverse().join("");
	for (let [k, v] of Object.entries<number | string>(o)) {
		v = String(v).split("").reverse().join("");
		format = format.replace(new RegExp(`${k}{1,${v.length}}`), v).replace(new RegExp(`${k}`, "g"), "0");
	}
	return format.split("").reverse().join("");
};
