export default <T>(obj: T, ...keys: (keyof T)[]) => keys.forEach(key => delete obj[key]);
