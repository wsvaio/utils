import { Plugin } from "vite";
export default (): Plugin => {
  return {
    name: "plugin-vue:templateExtendTag",

    transform(this, code, id, options?) {
      if (!id.endsWith(".vue")) return;

      // 获取第一个匹配到的template标签
      const matched = code.match(/(<template[^>]*?(tag\s*?=\s*?"(\w*?)")[^>]*?>)(.*)<\/template>/msi);

      if (matched) {
        const [, template, tag, tagName, content] = matched;
        const t = template + template.replace(tag, "").replace("template", tagName) + content + `</${tagName}></template>`;
        code = code.replace(/<template[^>]*?>.*<\/template>/msi, t);
      }
      return code;
    },

  };
};


