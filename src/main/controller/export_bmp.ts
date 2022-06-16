import * as fs from 'fs/promises';
import * as path from 'path';

import { dialog, ipcMain } from 'electron';
import emptyDir from 'empty-dir';

import common from '../common';

ipcMain.on('export-bmp', async (event, min: number, max: number) => {
  const ret = await dialog.showOpenDialog(common.mainWindow, {
    title: '选择导出的目录',
    properties: [ 'createDirectory', 'openDirectory', 'promptToCreate' ],
  });

  if (ret.canceled) {
    common.mainWindow.webContents.send('export-bmp-canceled');
    return;
  }

  if (!ret.filePaths || !ret.filePaths.length) {
    common.mainWindow.webContents.send('export-bmp-canceled');
    return;
  }

  if (min < 0) {
    common.mainWindow.webContents.send('export-bmp-error', '起始序号不能小于 0。');
    return;
  }

  const dir = ret.filePaths[0];
  let isEmpty;
  try {
    isEmpty = await emptyDir(dir);
  } catch (e) {
    common.mainWindow.webContents.send('export-bmp-error', e.message);
    return;
  }

  if (!isEmpty) {
    common.mainWindow.webContents.send('export-bmp-error', '目录不为空。');
    return;
  }

  const { wil } = common;
  if (!wil || !wil.isReady) {
    common.mainWindow.webContents.send('export-bmp-error', 'WIL 文件未加载。');
    return;
  }

  if (max >= wil.count()) {
    common.mainWindow.webContents.send('export-bmp-error', `结束序号不能大于 ${wil.count()}。`);
    return;
  }

  try {
    console.log(min, max, '<<');
    for (let i = min, j = 0; i <= max; i++, j++) {
      const bitmap = await wil.getBitmap(i);
      const buff = await bitmap.dumpBmp();
      const filename = path.join(dir, `${i}.bmp`);
      await fs.writeFile(filename, buff);
      common.mainWindow.webContents.send('export-bmp-progress', j + 1);
    }
  } catch (e) {
    common.mainWindow.webContents.send('export-bmp-error', e.message);
    return;
  }

  common.mainWindow.webContents.send('export-bmp-done', dir);
});
