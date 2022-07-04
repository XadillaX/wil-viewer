import { Button, Input, message } from 'antd';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import MiddleEllipsis from 'react-middle-ellipsis';
import { MinusOutlined, OneToOneOutlined, PlusOutlined } from '@ant-design/icons';

import './Toolbar.css';
import { WilFile } from '../state/WilFile';
import { PreviewOperator } from '../state/PreviewOperator';
import { useEffect, useState } from 'react';

function Toolbar() {
  const wilFile = WilFile.useContainer();
  const previewOperator = PreviewOperator.useContainer();

  const [ jumpTo, setJumpTo ] = useState(-1);
  const [ zoomValue, setZoomValue ] = useState(1);
  const [ stashedZoomValue, setStashedZoomValue ] = useState('100%');

  const open = async () => {
    const ret = await ipcRenderer.invoke('open-file') as OpenDialogReturnValue;
    if (ret.canceled) return;
    if (!ret.filePaths.length) return;

    const fn = ret.filePaths[0];
    let picCount: number;
    try {
      picCount = (await ipcRenderer.invoke('parse-file', fn)) as number;
    } catch (e) {
      message.error(e.message);
      return;
    }

    wilFile.open(fn, picCount);
  };

  useEffect(() => {
    setJumpTo(previewOperator.selectedIdx);
  }, [ wilFile.fileUUID, previewOperator.selectedIdx ]);

  useEffect(() => {
    setZoomValue(previewOperator.zoom);
    setStashedZoomValue((previewOperator.zoom * 100).toFixed(0) + '%');
  }, [ previewOperator.zoom ]);

  return (
    <div id="wil-toolbar">
      <div id="wil-toolbar-left">
        <Button size="small" type="default" onClick={open}>打开</Button>
        <div id="wil-toolbar-open-pos" style={{ width: 'calc(100% - 20px)', whiteSpace: 'nowrap', marginLeft: '10px', marginRight: '10px' }}>
          <MiddleEllipsis>
            <span>
              {wilFile.filename}
            </span>
          </MiddleEllipsis>
        </div>
      </div>
      <div id="wil-toolbar-center">
        <div>
          <Input
            style={{ width: '25px', height: '16px', fontSize: '12px', padding: 0, textAlign: 'center' }}
            value={jumpTo === -1 ? '' : jumpTo.toString()}
            onChange={e => {
              const v = e.target.value;
              if (v === '') {
                setJumpTo(-1);
                return;
              }

              const n = parseInt(v, 10);
              if (isNaN(n)) return;
              if (n < 0 || n >= wilFile.picCount) return;
              setJumpTo(n);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (jumpTo < -1 || jumpTo >= wilFile.picCount) {
                  setJumpTo(previewOperator.selectedIdx);
                } else {
                  previewOperator.select(jumpTo);
                  previewOperator.thumbnailListRef?.current.selectCell({ idx: 0, rowIdx: jumpTo });
                }
              }
            }}
            onBlur={e => {
              if (jumpTo < -1 || jumpTo >= wilFile.picCount) {
                setJumpTo(previewOperator.selectedIdx);
              } else {
                previewOperator.select(jumpTo);
                previewOperator.thumbnailListRef?.current.selectCell({ idx: 0, rowIdx: jumpTo });
              }
            }}
          />
          <span style={{ userSelect: 'none', fontSize: '12px' }}>&nbsp;/ {(wilFile.picCount - 1 < 0) ? '-' : (wilFile.picCount - 1)}</span>
        </div>
        <span style={{ borderLeft: 'solid 1px rgba(255, 255, 255, .4)', marginLeft: '10px', marginRight: '10px', height: '18px' }}></span>
        <div id="toolbar-zoom">
          <Button
            disabled={zoomValue < 0.2}
            size="small"
            style={{ width: '16px', height: '16px', minWidth: '16px' }}
            type="default"
            shape="circle"
            icon={<MinusOutlined />}
            onClick={() => {
              previewOperator.zoomTo(previewOperator.zoom - 0.1);
            }}
          />
          <Input
            style={{ height: '16px', width: '45px', marginLeft: '3px', marginRight: '3px', padding: '0', fontSize: '12px', textAlign: 'center' }}
            value={stashedZoomValue}
            onChange={e => {
              const v = e.target.value;
              if (v && !/^\d+%?$/.test(v)) return;

              if (!v) {
                setStashedZoomValue(v);
                return;
              }

              const numStr = v.replace('%', '');
              const num = parseInt(numStr, 10);
              if (isNaN(num)) return;
              if (num > 400) return;
              setStashedZoomValue(v);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const numStr = stashedZoomValue.replace('%', '');
                const num = parseInt(numStr, 10);
                if (isNaN(num)) return previewOperator.zoomTo(1);
                if (num < 10) return previewOperator.zoomTo(0.1);
                if (num > 400) return previewOperator.zoomTo(4);
                previewOperator.zoomTo(num / 100);
              }
            }}
            onBlur={e => {
              const numStr = stashedZoomValue.replace('%', '');
              const num = parseInt(numStr, 10);
              if (isNaN(num)) return previewOperator.zoomTo(1);
              if (num < 10) return previewOperator.zoomTo(0.1);
              if (num > 400) return previewOperator.zoomTo(4);
              previewOperator.zoomTo(num / 100);
            }}
          />
          <Button
            disabled={zoomValue > 3.9}
            size="small"
            style={{ width: '16px', height: '16px', minWidth: '16px' }}
            type="default"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => {
              previewOperator.zoomTo(previewOperator.zoom + 0.1);
            }}
          />
          <span style={{ borderLeft: 'solid 1px rgba(255, 255, 255, .4)', marginLeft: '10px', marginRight: '10px', height: '18px' }}></span>
          <Button
            size="small"
            style={{ width: '16px', height: '16px', minWidth: '16px' }}
            type="default"
            shape="circle"
            icon={<OneToOneOutlined />}
            onClick={() => {
              previewOperator.zoomTo(1);
              previewOperator.dragTo(0, 0);
            }}
          />
        </div>
      </div>
      <div id="wil-toolbar-right">
      </div>
    </div>
  );
}

export default Toolbar;
