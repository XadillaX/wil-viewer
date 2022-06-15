import common from '../common';
import { dialog, ipcMain } from 'electron';

ipcMain.handle('open-file', async () => {
  const ret = await dialog.showOpenDialog(common.mainWindow, {
    title: '选择 WIL 资源文件',
    filters: [{ name: 'WIL 资源文件', extensions: [ 'wil', 'WIL' ] }],
    properties: [ 'openFile' ],
  });

  return ret;
});
