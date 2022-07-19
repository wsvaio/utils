import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";


interface dirResolverOptions {

  alias?: string, // 导入的路径别名
  target?: string; // 导入的路径
  prefix?: string; // 导入文件的前缀过滤
  suffix?: string; // 导入文件的后缀过滤
  include?: string[]; // 导入的文件
  exclude?: string[]; // 不导入的文件

}

/**
 * 自动按需导入文件夹下的所有文件的导出（包括默认导出和普通导出）
 */

export default (options?: dirResolverOptions) => {

  const {
    prefix = "use", suffix = "",
    include = [], exclude = [],
    target = "src/composables",
    alias = "@/composables",
  } = options ?? {};


  // 添加 过滤 要导入的文件至include
  include.push(...readdirSync(target).filter(
    item => !exclude.includes(item)
      && item.startsWith(prefix)
      && item.endsWith(suffix + ".ts"))
  );


  // 解析所有文件的所有默认导出和普通导出
  const expList = include.map(item => {
    const file = readFileSync(resolve(target, item));
    const content = new TextDecoder().decode(file);
    const regExp = /export const ([^\s{}]*|{.*?}) =?/gmsi;
    const matches = content.matchAll(regExp);
    const result: string[] = [];
    for (const [, name] of matches) name.startsWith("{")
      ? result.push(...name.replaceAll(/[,{}]/g, "").trim().split(/[\s]/))
      : result.push(name);

    let defaultName = "";
    if (/export default/.test(content)) {
      const pathSplit = `${target}/${item}`.replace(".ts", "").split("/").reverse();
      defaultName = pathSplit[0] == "index" ? pathSplit[1] : pathSplit[0];
    }

    // path：文件路径，exps：普通导出名称列表，defaultName：默认导出名
    return { path: `${target}/${item}`, exps: result, defaultName };

  });

  return (name: string) => {

    for (const { path, exps, defaultName } of expList) {

      if ([defaultName, ...exps].includes(name)) {
        console.log(name, exps, path.replace(target, alias));

        return {
          path: path.replace(target, alias).replace(".ts", ""),
          importName: name == defaultName ? "default" : name,
        };

      }

    }
  };
};

