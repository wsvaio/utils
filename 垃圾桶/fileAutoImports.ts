import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";


export default (path: string, packageName?: string) => {
  const file = readFileSync(path);
  const content = new TextDecoder().decode(file);
  const regExp = /export const (\S*) =?/gmsi;
  const matches = content.matchAll(regExp);
  const result: (string | [string, string])[] = [];
  for (const [, name] of matches) result.push(name);

  const pathList = path.replace(".ts", "").split(/[\\\/]/).reverse();

  if (/export default/.test(content)) result.push(["default", pathList[0] == "index" ? pathList[1] : pathList[0]]);
  return {
    [packageName ?? path]: result
  };
};
