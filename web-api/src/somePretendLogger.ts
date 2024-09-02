import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();
asyncLocalStorage.getStore()

export function withTraceId(traceId: string, fn: any) {
  return asyncLocalStorage.run(traceId, fn);
}

export function log(message: string) {
  const traceId = asyncLocalStorage.getStore();
  console.log(`${message} traceId=${traceId}`);
}

export function switchItUp() {
  asyncLocalStorage.enterWith('YOU GOT SWAPPED');
}


const idk = ReflectApply