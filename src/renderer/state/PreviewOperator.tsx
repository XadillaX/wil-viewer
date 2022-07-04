import { createContainer } from 'unstated-next';
import React, { useState } from 'react';
import { TLPointerInfo } from '@tldraw/core';

import { getListCache, IListCacheItem, ImageLoadStatus, ListCacheType } from '../lib/ListCache';
import { DataGridHandle } from 'react-data-grid';

interface ICameraValues {
  zoom: number;
  centerOffset: [ number, number ];
}

const cameraValues: ICameraValues = {
  zoom: 1,
  centerOffset: [ 0, 0 ],
}

function usePreviewOperator() {
  const [ zoom, setZoom ] = useState<number>(1);
  const [ centerOffset, setCenterOffset ] = useState<[ number, number ]>([ 0, 0 ]);
  const [ selectedIdx, setSelectedIdx ] = useState<number>(-1);
  const [ selectedPreview, setSelectedPreview ] = useState<IListCacheItem>({
    idx: -1,
    loadState: ImageLoadStatus.NotStarted,
  });
  const [ thumbnailListRef, setThumbnailListRef ] = useState<React.MutableRefObject<DataGridHandle>>(null);

  return {
    zoom,
    centerOffset,
    selectedIdx,
    selectedPreview,

    thumbnailListRef,
    setThumbnailListRef,

    emitZoom: (e: React.WheelEvent<Element> | WheelEvent) => {
      const delta: number = (e as any).wheelDeltaY;
      const percent = 0.1 * delta / 120;
      const newZoom = cameraValues.zoom + percent;
      if (newZoom < 0.1) {
        return;
      }

      if (newZoom > 4) {
        return;
      }

      cameraValues.zoom = newZoom;
      setZoom(newZoom);
    },

    zoomTo: (v: number) => {
      if (v < 0.1) return;
      if (v > 4) return;
      cameraValues.zoom = v;
      setZoom(v);
    },

    emitDrag: (info: TLPointerInfo) => {
      cameraValues.centerOffset = [
        cameraValues.centerOffset[0] + info.delta[0] / cameraValues.zoom,
        cameraValues.centerOffset[1] + info.delta[1] / cameraValues.zoom,
      ];
      setCenterOffset(cameraValues.centerOffset);
    },

    dragTo: (x: number, y: number) => {
      cameraValues.centerOffset = [ x, y ];
      setCenterOffset(cameraValues.centerOffset);
    },

    select: (idx: number) => {
      setSelectedIdx(idx);

      if (idx < 0) {
        setSelectedPreview({
          idx,
          loadState: ImageLoadStatus.NotStarted,
        });
        return;
      }

      const preview = getListCache(ListCacheType.Preview);
      const item = preview.list[idx] || { idx, loadState: ImageLoadStatus.NotStarted };
      setSelectedPreview(JSON.parse(JSON.stringify(item)));
    },
  };
}

export const PreviewOperator = createContainer(usePreviewOperator);
