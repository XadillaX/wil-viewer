import DataGrid from 'react-data-grid';

import './ThumbnailList.css';
import Bus, { IImageItem, ImageItemLoadingStatus } from '../bus';
import { Spin } from 'antd';
import { ipcRenderer } from 'electron';

interface IThumbnailListProps {
  bus: Bus;
}

function ThumbnailList({ bus }: IThumbnailListProps) {
  const triggerLoad = async (row: IImageItem, fileUUID: string) => {
    let ret: string;
    try {
      ret = await ipcRenderer.invoke('dump-bmp', row.idx, true);
    } catch (e) {
      // TODO(XadillaX): Do something.
      console.error(e);
      return;
    }

    if (bus.fileUUID !== fileUUID) {
      return;
    }

    row.base64 = `data:image/png;base64,${ret}`;
    row.loading = ImageItemLoadingStatus.Loaded;
    bus.setImagesList([ ...bus.imagesList ]);
  };

  return (
    <div id="thumbnail-list">
      <DataGrid
        rowClass={() => { return 'thumbnail-list-row'; }}
        rowHeight={150}
        style={{ blockSize: '100%', background: 'none' }}
        columns={[{
          key: 'pic',
          name: '缩略图',
          formatter: ({ row }: { row: IImageItem }) => {
            if (row.loading === ImageItemLoadingStatus.NotStarted) {
              row.loading = ImageItemLoadingStatus.Loading;
              triggerLoad(row, bus.fileUUID);
            }

            const img = row.loading !== ImageItemLoadingStatus.Loaded ?
              <></> :
              (<img src={row.base64} style={{ maxWidth: '100px', maxHeight: '100px' }} />);

            return (
              <div>
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
                  <Spin
                    spinning={row.loading === ImageItemLoadingStatus.Loading}
                  >
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
        rows={bus.imagesList}
        headerRowHeight={0}
      />
    </div>
  );
}

export default ThumbnailList;
