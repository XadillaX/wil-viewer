export interface IDeferred<T> {
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (reason?: Error) => void;
  promise: Promise<T>;
}

export function createDeferred<T>(): IDeferred<T> {
  let resolve: (value?: T | PromiseLike<T>) => void;
  let reject: (reason?: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise,
  };
}
