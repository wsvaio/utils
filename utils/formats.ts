// 时间格式化
export function timeFormat(seconds: number, format = "HH:mm:ss") {

  const o = {
    "h": 0,
    "m": 0,
    "s": 0,

    "H": 0,
    "M": 0,
    "S": 0,

    toString() {
      format = format.split("").reverse().join("");
      for (const k of ["h", "m", "s", "H", "M", "S"]) {
        const v = String(this[k]).split("").reverse().join("");
        format = format.replace(new RegExp(`${k}{1,${v.length}}`), v)
          .replace(new RegExp(`${k}`, "g"), "0");
      }
      return format.split("").reverse().join("");
    }
  }

  let time = o.S = Math.floor(seconds ?? 0);
  o.s = time % 60;

  time = o.M = (time - o.s) / 60;
  o.m = time % 60;

  time = o.H = (time - o.m) / 60;
  o.h = time % 60;

  return o;

}

// 日期格式化
export function dateFormat(date: string | Date | number | null | undefined, format = "yyyy-MM-dd HH:mm:ss") {
  // sDate = sDate.replace("T", " ").replace("Z", " ").replaceAll("-", "/");
  if (typeof date == "string") date = date.replace(/-/g, "/").replace("T", " ").replace("Z", " ");
  date = new Date(date || Date.now());
  const o = {
    "Y": date.getFullYear(),
    "y": date.getFullYear(),
    "M": date.getMonth() + 1,
    "d": date.getDate(),
    "H": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds(),
    "S": date.getMilliseconds(),
    "w": date.getDay()
  };
  format = format.split("").reverse().join("");
  for (let [k, v] of Object.entries<number | string>(o)) {
    v = String(v).split("").reverse().join("");
    format = format.replace(new RegExp(`${k}{1,${v.length}}`), v)
      .replace(new RegExp(`${k}`, "g"), "0");
  }
  return format.split("").reverse().join("");
}

