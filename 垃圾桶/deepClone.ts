type Clonable = any;

function isObject(target: Clonable): boolean {
  return typeof target === 'object' && target !== null;
}

function cloneDeep(target: Clonable, map = new WeakMap()): Clonable {
  // 处理基本数据类型和函数
  if (!isObject(target)) {
    return target;
  }

  // 处理数组
  if (Array.isArray(target)) {
    if (map.has(target)) {
      return map.get(target);
    }
    const newArr = target.map((item) => cloneDeep(item, map));
    map.set(target, newArr);
    return newArr;
  }

  // 处理普通对象
  if (typeof target === 'object') {
    if (map.has(target)) {
      return map.get(target);
    }
    const newObj = Object.create(Object.getPrototypeOf(target));
    map.set(target, newObj);
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        newObj[key] = cloneDeep(target[key], map);
      }
    }
    return newObj;
  }

  throw new Error('Unable to handle the data type');
}

