export const createEventBus = (map = new Map<string, Function[]>()) => ({
  map,
  on<T = any>(type: string, handler: (event: T) => any) {
    const handlers = map.get(type);
    handlers
      ? handlers.splice(handlers.indexOf(handler) >>> 0, 1) && handlers.push(handler)
      : map.set(type, [handler]);
  },
  off<T = any>(type: string, handler?: (event: T) => any) {
    const handlers = map.get(type);
    if (!handlers) return;
    handler
      ? handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      : map.set(type, []);
  },
  emit<T = any>(type: string, event?: T) {
    const handlers = map.get(type);
    handlers && handlers.forEach(handler => handler(event ?? type));
  }
});
