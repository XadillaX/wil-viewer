import DataGrid, { DataGridHandle } from 'react-data-grid';
import { Scarlet, TaskObject, TaskProcessor } from 'scarlet-task';

import './ThumbnailList.css';
import Bus, { IImageItem, ImageItemLoadingStatus } from '../bus';
import { Spin } from 'antd';
import { ipcRenderer } from 'electron';
import { useEffect, useRef } from 'react';

interface IThumbnailListProps {
  bus: Bus;
}

function findRealRow(bus: Bus, idx: number): IImageItem | null {
  const { realImageList } = bus;
  return realImageList[idx] || null;
}

const scarlet = new Scarlet(10);

function ThumbnailList({ bus }: IThumbnailListProps) {
  const ref = useRef<DataGridHandle>(null);
  interface ILoadThumbnailParameter { idx: number, fileUUID: string }
  const loadThumbnail: TaskProcessor<ILoadThumbnailParameter> = async (to: TaskObject<ILoadThumbnailParameter>) => {
    const { task } = to;
    const row = findRealRow(bus, task.idx);
    if (!row || bus.fileUUID !== task.fileUUID) {
      return to.done();
    }

    let ret: IDumpBMPResult;
    try {
      ret = await ipcRenderer.invoke('dump-bmp', task.idx, true);
    } catch (e) {
      if (bus.fileUUID !== task.fileUUID) {
        return to.done();
      }

      row.loading = ImageItemLoadingStatus.NotStarted;
      bus.setDisplayImageList([ ...bus.realImageList ]);

      console.error(e);
      return to.done();
    }

    if (bus.fileUUID !== task.fileUUID) {
      return to.done();
    }

    row.loading = ImageItemLoadingStatus.Loaded;
    row.base64 = `data:image/png;base64,${ret.base64}`;

    const id = `thumb-idx-${task.idx}`;
    if (ref.current.element.querySelector(`#${id}`)) {
      bus.setDisplayImageList([ ...bus.realImageList ]);
    }

    to.done();
  };

  useEffect(() => {
    ref.current.scrollToRow(0);
    ref.current.selectCell({ idx: -1, rowIdx: -1 });
  }, [ bus.fileUUID ]);

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
          formatter: ({ row: displayRow, isCellSelected }) => {
            const row = findRealRow(bus, displayRow.idx);
            if (row.loading === ImageItemLoadingStatus.NotStarted) {
              const { fileUUID } = bus;
              row.loading = ImageItemLoadingStatus.LoadingViaScroll;
              scarlet.push({ idx: row.idx, fileUUID }, loadThumbnail);
            }

            if (isCellSelected && bus.selectedIdx !== row.idx) {
              queueMicrotask(() => {
                bus.setSelectedIdx(row.idx);
              });
            }

            const img = row.loading !== ImageItemLoadingStatus.Loaded ?
              (<></>) :
              (<img src={row.base64} style={{ maxWidth: '100px', maxHeight: '100px' }} />);

            return (
              <div id={`thumb-idx-${row.idx}`}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '10px',
                    background: '#fff',
                  }}
                >
                  <Spin spinning={row.loading === ImageItemLoadingStatus.LoadingViaAuto || row.loading === ImageItemLoadingStatus.LoadingViaScroll}>
                    <div style={{ width: '100px', height: '100px', lineHeight: '100px', textAlign: 'center', fontSize: '0px' }}>
                      {img}
                    </div>
                  </Spin>
                </div>
                <div style={{ textAlign: 'center', color: '#fff', lineHeight: 1, marginTop: '12px' }}>{row.idx}</div>
              </div>
            );
          },
        }]}
        rows={bus.displayImageList}
        headerRowHeight={0}
      />
    </div>
  );
}

export default ThumbnailList;
