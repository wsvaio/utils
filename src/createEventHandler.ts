/**
 * 创建事件处理器
 * @param map 存储事件类型及其对应处理函数的 Map 对象
 * @returns 事件处理器对象
 */
export function createEventHandler(map = new Map<string, Function[]>()) {
  return {
    map,
    /**
     * 注册事件处理函数
     * @param type 事件类型
     * @param handler 事件处理函数
     */
    on<T = any>(type: string, handler: (event: T) => any) {
      const handlers = map.get(type);
      handlers ? handlers.splice(handlers.indexOf(handler) >>> 0, 1) && handlers.push(handler) : map.set(type, [handler]);
    },
    /**
     * 注销事件处理函数
     * @param type 事件类型
     * @param handler 事件处理函数，若不传则注销该事件类型下的所有处理函数
     */
    off<T = any>(type: string, handler?: (event: T) => any) {
      const handlers = map.get(type);
      if (!handlers)
        return;
      handler ? handlers.splice(handlers.indexOf(handler) >>> 0, 1) : map.set(type, []);
    },
    /**
     * 触发事件
     * @param type 事件类型
     * @param event 事件对象，可选
     */
    emit<T = any>(type: string, event?: T) {
      const handlers = map.get(type);
      handlers && handlers.forEach(handler => handler(event ?? type));
    },
  };
}

/**
 * 别名，创建事件总线
 * @param map 存储事件类型及其对应处理函数的 Map 对象
 * @returns 事件处理器对象
 */
export const createEventBus = createEventHandler;
