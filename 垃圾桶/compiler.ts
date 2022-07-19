import * as sfc from "vue/compiler-sfc";

export default {
  ...sfc,
  
  // 检查根<template>是否有tag属性 如果有则在原来的基础上添加这个el标签包裹
  parse(source, options) {
    // 获取第一个匹配到的template标签
    const matched = source.match(/(<template[^>]*?(tag\s*?=\s*?"(\w*?)")[^>]*?>)(.*)<\/template>/msi);
    
    if (matched) {
      const [ , template, tag, tagName, content ] = matched;
      const t = template + template.replace(tag, "").replace("template", tagName) + content + `</${tagName}></template>`;
      source = source.replace(/<template[^>]*?>.*<\/template>/msi, t);
    }
    return sfc.parse(source, options);
  }

}