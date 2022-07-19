import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { ImportNameAlias, ImportsMap, PresetName } from "unplugin-auto-import/types";

interface dirImportOpts {
  alias: string, // 导入的路径别名
  target: string; // 导入的路径
  prefix?: string; // 导入文件的前缀过滤
  suffix?: string; // 导入文件的后缀过滤
  include?: string[]; // 导入的文件
  exclude?: string[]; // 不导入的文件
}

export default (...options: (dirImportOpts | PresetName)[]): (ImportsMap | PresetName)[] => {

  const importMap: ImportsMap = {};
  const presetNames: PresetName[] = [];

  for (const opt of options) {

    if (typeof opt == "string") {
      presetNames.push(opt);
      continue;
    }

    const { target, alias, include = [], exclude = [], prefix = "", suffix = "" } = opt;

    // 添加 过滤 要导入的文件至include
    include.push(...readdirSync(target).filter(
      item => !exclude.includes(item)
        && item.startsWith(prefix)
        && item.endsWith(suffix + ".ts"))
    );

    // 解析所有文件的所有默认导出和普通导出
    for (const item of include) {
      const file = readFileSync(resolve(target, item));
      const content = new TextDecoder().decode(file);
      const regExp = /export const ([^\s{}]*|{.*?}) =?/gmsi;
      const matches = content.matchAll(regExp);
      const result: (string | ImportNameAlias)[] = [];
      for (const [, name] of matches) name.startsWith("{")
        ? result.push(...name.replaceAll(/[,{}]/g, "").trim().split(/[\s]/))
        : result.push(name);

      if (/export default/.test(content)) {
        const pathSplit = `${target}/${item}`.replace(".ts", "").split("/").reverse();
        const defaultName = pathSplit[0] == "index" ? pathSplit[1] : pathSplit[0];
        result.push(["default", defaultName]);
      }

      importMap[`${alias}/${item}`.replace(".ts", "")] = result;
    }
  }

  return [importMap, ...presetNames];
};

