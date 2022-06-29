import { Button, message } from 'antd';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import { MenuOutlined } from '@ant-design/icons';

import './Toolbar.css';
import Bus from '../bus';

interface IToolbarProps {
  bus: Bus;
}

function Toolbar({ bus }: IToolbarProps) {
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

    bus.setFilename(fn);
    bus.setPicCount(picCount);
    bus.refreshUUID();
    bus.recacheImagesList(picCount);
  };

  return (
    <div id="wil-toolbar">
      <div id="wil-toolbar-left">
        <Button icon={<MenuOutlined />} ghost type="default" style={{ border: 0 }} />
        <span style={{ marginInlineStart: '16px' }}>
          <Button size="small" type="default" onClick={open}>打开</Button>
        </span>
      </div>
      <div id="wil-toolbar-center">
      </div>
      <div id="wil-toolbar-right">
      </div>
    </div>
  );
}

export default Toolbar;
