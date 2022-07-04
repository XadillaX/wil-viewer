import { createContainer } from 'unstated-next';
import { useState } from 'react';

import { getListCache, IListCacheItem, ImageLoadStatus, ListCacheType } from '../lib/ListCache';

interface IListCacheInitialState {
  type: ListCacheType
}

export function useListCache(initialState: IListCacheInitialState) {
  const [ type ] = useState<ListCacheType>(initialState?.type || ListCacheType.Thumbnail);
  const [ list, setList ] = useState<IListCacheItem[]>([]);

  const listCache = () => getListCache(type);

  return {
    list,
    type,

    get listCache() {
      return listCache();
    },

    load: async (
      idx: number,
      loadStatus: ImageLoadStatus = ImageLoadStatus.LoadingViaAuto,
      autoFlush?: boolean,
    ) => {
      const loaded = await listCache().load(idx, loadStatus);
      if (!loaded) {
        return false;
      }
      if (autoFlush) listCache().flush(setList);
      return true;
    },

    realloc(picCount: number) {
      listCache().realloc(picCount, setList);
    },

    flush() {
      listCache().flush(setList);
    },
  };
}

export const ListCache = createContainer(useListCache);
