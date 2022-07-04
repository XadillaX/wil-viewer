import { createContainer } from 'unstated-next';
import { useState } from 'react';
import uuid from 'uuid-1345';

import { useListCache } from './ListCache';

export interface IImageItem {
  idx: number;
}

export interface IWilFileInitialState {
  filename?: string;
  fileUUID?: string;
  picCount?: number;
  itemList?: IImageItem[];
}

function useWilFile(initialState: IWilFileInitialState) {
  const [ filename, setFilename ] = useState<string>(initialState?.filename || '');
  const [ fileUUID, setFileUUID ] = useState<string>(initialState?.fileUUID || '');
  const [ picCount, setPicCount ] = useState<number>(initialState?.picCount || 0);

  const [ listCache, setListCache ] = useState<ReturnType<typeof useListCache>>(null);
  const [ previewCache, setPreviewCache ] = useState<ReturnType<typeof useListCache>>(null);

  return {
    filename,
    fileUUID,
    picCount,

    setListCache,
    setPreviewCache,

    open: (filename: string, picCount: number) => {
      setFilename(filename);
      setFileUUID(uuid.v1());
      setPicCount(picCount);

      if (listCache) {
        listCache.realloc(picCount);
      }

      if (previewCache) {
        previewCache.realloc(picCount);
      }
    },
  };
}

export const WilFile = createContainer(useWilFile);
