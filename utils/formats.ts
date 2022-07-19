// 时间格式化
export function timeFormat(seconds: number, format = "HH:mm:ss") {
  let time = Math.floor(seconds ?? 0);

  seconds = time;
  const _seconds = seconds % 60;

  time = (time - _seconds) / 60;

  const minutes = time;
  const _minutes = time % 60;

  time = (time - _minutes) / 60;
  const _hours = time;

  return {
    _hours, _minutes, _seconds,
    minutes, seconds,

    toString() {
      return format.replace(/H+/, strNum(_hours, 2))
        .replace(/m+/, strNum(_minutes, 2))
        .replace(/s+/, strNum(_seconds, 2));
    }
  };

}

function strNum(num: number, length: number) {
  let lNum = String(num).split("");

  while (lNum.length < length) {
    lNum.unshift("0");
  }
  return lNum.join("");
}


// 日期格式化
export function dateFormat(date: string | Date | number | null | undefined, format = "yyyy-MM-dd HH:mm:ss") {
  // sDate = sDate.replace("T", " ").replace("Z", " ").replaceAll("-", "/");
  if (typeof date == "string") date = date.replace(/-/g, "/");
  if (!date) date = Date.now();
  const lFormat = format.split("").reverse();
  const oDate = new Date(date);
  const o: any = {
    "y": oDate.getFullYear(),
    "M": oDate.getMonth() + 1,
    "d": oDate.getDate(),
    "H": oDate.getHours(),
    "m": oDate.getMinutes(),
    "s": oDate.getSeconds(),
    "S": oDate.getMilliseconds(),
    "w": oDate.getDay()
  };
  for (let [k, v] of Object.entries(o)) {
    for (let num of String(v).split("").reverse()) {
      lFormat[lFormat.indexOf(k)] = num;
    }
    for (let [index, value] of Object.entries(lFormat)) {
      if (k == value) lFormat[Number(index)] = "0";
    }
  }
  return lFormat.reverse().join("");
}

