import DataGrid, { DataGridHandle } from 'react-data-grid';

import './ThumbnailList.css';
import { Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { WilFile } from '../state/WilFile';
import { ListCache } from '../state/ListCache';
import { ImageLoadStatus } from '../lib/ListCache';
import { PreviewOperator } from '../state/PreviewOperator';

function ThumbnailList() {
  const wilFile = WilFile.useContainer();
  const listCache = ListCache.useContainer();
  const previewOperator = PreviewOperator.useContainer();

  const ref = useRef<DataGridHandle>(null);
  useEffect(() => {
    wilFile.setListCache(listCache);
    ref.current.selectCell({ idx: 0, rowIdx: 0 });
    previewOperator.setThumbnailListRef(ref);
  }, [ wilFile.fileUUID ]);

  return (
    <div id="thumbnail-list">
      <DataGrid
        ref={ref}
        rowClass={() => { return 'thumbnail-list-row'; }}
        rowHeight={150}
        style={{ blockSize: '100%', background: 'none' }}
        columns={[{
          key: 'pic',
          name: '缩略图',
          formatter: ({ row, isCellSelected }) => {
            if (row.loadState === ImageLoadStatus.NotStarted) {
              listCache.load(row.idx, ImageLoadStatus.LoadingViaScroll).finally(() => {
                const ele = document.querySelector(`#thumb-idx-${row.idx}`);
                if (!ele) return;

                setImmediate(() => {
                  listCache.flush();
                });
              });
            }

            if (isCellSelected && previewOperator.selectedIdx !== row.idx) {
              queueMicrotask(() => {
                previewOperator.select(row.idx);
              });
            }

            const img = row.loadState !== ImageLoadStatus.Loaded ?
              (<></>) :
              (<img
                src={`data:image/png;base64,${row?.content.base64}`}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />);

            return (
              <div id={`thumb-idx-${row.idx}`}>
                <div className="thumbnail-list-row-content">
                  <Spin
                    spinning={
                      [
                        ImageLoadStatus.NotStarted,
                        ImageLoadStatus.LoadingViaAuto,
                        ImageLoadStatus.LoadingViaScroll,
                      ].includes(row.loadState)
                    }
                  >
                    <div className="thumb-image-wrapper">
                      {img}
                    </div>
                  </Spin>
                </div>
                <div className="thumb-id-wrapper">{row.idx}</div>
              </div>
            );
          },
        }]}
        rows={listCache.list}
        headerRowHeight={0}
      />
    </div>
  );
}

export default ThumbnailList;
