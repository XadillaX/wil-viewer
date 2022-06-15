import { ipcMain } from 'electron';
import { parse } from 'wil-parser';

import common from '../common';

ipcMain.handle('parse-file', async (_, filename: string) => {
  if (common.wil) {
    common.wil.destroy();
  }

  const wil = await parse(filename);
  common.wil = wil;
  return wil.count();
});
