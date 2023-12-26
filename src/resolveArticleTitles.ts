/**
 * 解析文章标题
 * @template T
 * @param {T} doc - 文档元素
 * @returns {Array<{ el: HTMLElement }>} - 标题数组
 */
export function resolveArticleTitles<T extends Element>(doc: T): Array<{ el: HTMLElement }> {
  const titles: {
    el: HTMLElement;
  }[] = [];

  doc.childNodes.forEach(e => {
    if (/h\d/i.test(e.nodeName)) {
      titles.push({
        el: e as HTMLElement,
      });
    }
  });

  return titles;
}

interface Title {
  el: HTMLElement;
  children: Title[];
}

/**
 * 将文章标题解析为树形结构
 * @template T
 * @param {T} doc - 文档元素
 * @returns {Array<{ el: HTMLElement, children: Title[] }>} - 标题树
 */
export function resolveArticleTitlesToTree<T extends Element>(doc: T): Array<{ el: HTMLElement; children: Title[] }> {
  const titles = resolveArticleTitles(doc);

  const r = (list: { el: HTMLElement }[]) => {
    const result: Title[] = [];
    const min = Math.min(...list.map(item => +item.el.nodeName.slice(1)));
    for (const item of list.filter(item => +item.el.nodeName.slice(1) === min)) {
      const start = list.indexOf(item) + 1;
      const end = list.slice(start).findIndex(sub => sub.el.nodeName == item.el.nodeName);
      result.push({
        el: item.el,
        children: r(list.slice(start, end == -1 ? list.length : end)),
      });
    }
    return result;
  };

  return r(titles);
}
