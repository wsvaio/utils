export { debounce, throttle } from "./utils/decorator";

export { dateFormat, timeFormat } from "./utils/formats";

export { createCompose, middleware, onion, plugins } from "./utils/createCompose";

export { default as merge, DeepPartial } from "./utils/merge";

export { default as Progress } from "./utils/Progress";
export { default as saveAs } from "./utils/saveAs";

export { ctx, createAPI } from "./utils/createAPI";

export { default as to } from "./utils/to";

export { default as toString } from "./utils/toString";

export { default as trying } from "./utils/trying";

export { default as createEventBus } from "./utils/createEventBus";

export { default as sleep } from "./utils/sleep";

export { default as exitFullscreen } from "./utils/exitFullscreen";
export { default as remove } from "./utils/remove";

export const rtn = <T>(o: T) => o;

export {default as omit} from "./utils/omit";
export {default as pick} from "./utils/pick";