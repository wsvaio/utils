export default <T>(fn: Promise<T>) => fn.then(data => (<[null, T]>[null, data])).catch(err => (<[Error, null]>[err, null]));