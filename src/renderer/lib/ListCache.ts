import { ipcRenderer } from 'electron';
import { createDeferred, IDeferred } from './Defer';

export enum ImageLoadStatus {
  NotStarted,
  LoadingViaScroll,
  LoadingViaAuto,
  Loaded,
  Destroyed,
  Failed,
}

export interface IListCacheItem {
  idx: number;
  loadState: ImageLoadStatus;
  content?: IDumpBMPResult;
}

export enum ListCacheType {
  Thumbnail,
  Preview,
}

export class ListCache {
  #list: IListCacheItem[];
  #loadPromise: Map<number, IDeferred<boolean>> = new Map();
  #type: ListCacheType;

  constructor(picCount: number, type: ListCacheType) {
    this.#type = type;
    this.realloc(picCount);
  }

  realloc(picCount: number, setListCache?: (list: IListCacheItem[]) => void) {
    this.#list = Array.from({
      length: picCount
    }, (_, idx) => ({
      idx,
      loadState: ImageLoadStatus.NotStarted,
    }));

    for (const entries of this.#loadPromise.entries()) {
      entries[1].resolve(false);
      entries[1].resolve = () => { /**/ };
      entries[1].reject = () => { /**/ };
    }
    this.#loadPromise.clear();

    if (setListCache) {
      this.flush(setListCache);
    }
  }

  flush(setListCache: (list: IListCacheItem[]) => void) {
    setListCache(this.toJSON());
  }

  get list() {
    return this.#list;
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this.list));
  }

  async load(idx: number, loadState: ImageLoadStatus = ImageLoadStatus.LoadingViaAuto) {
    if (idx < 0 || idx >= this.list.length) {
      return false;
    }

    if ([
      ImageLoadStatus.LoadingViaScroll,
      ImageLoadStatus.LoadingViaAuto,
    ].includes(this.list[idx].loadState)) {
      const deferred = this.#loadPromise.get(idx);
      if (deferred) {
        return deferred.promise;
      } else {
        return false;
      }
    }

    // TODO(XadillaX): retry.
    if ([
      ImageLoadStatus.Failed,
      ImageLoadStatus.Destroyed,
    ].includes(this.list[idx].loadState)) {
      return false;
    }

    if (this.list[idx].loadState === ImageLoadStatus.Loaded) {
      return true;
    }

    const deferred = createDeferred<boolean>();
    this.#loadPromise.set(idx, deferred);

    this.list[idx].loadState = loadState;

    ipcRenderer.invoke(
      'dump-bmp',
      idx,
      this.#type === ListCacheType.Thumbnail,
    ).then((ret: IDumpBMPResult) => {
      this.list[idx].loadState = ImageLoadStatus.Loaded;
      this.list[idx].content = ret;
      this.#loadPromise.delete(idx);
      deferred.resolve(true);
    }).catch(e => {
      this.list[idx].loadState = ImageLoadStatus.Failed;
      this.#loadPromise.delete(idx);
      console.error(e);
      deferred.resolve(false);
    });

    return deferred.promise;
  }
}

const cacheMap = new Map<ListCacheType, ListCache>();

export function getListCache(type: ListCacheType): ListCache {
  if (!cacheMap.has(type)) {
    cacheMap.set(type, new ListCache(0, type));
  }
  return cacheMap.get(type);
}
