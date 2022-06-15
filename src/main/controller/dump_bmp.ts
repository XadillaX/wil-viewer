import * as assert from 'assert'
import { ipcMain } from 'electron';
import { Wil } from 'wil-parser';
import jimp from 'jimp';

import common from '../common';

ipcMain.handle('dump-bmp', async (_, idx: number, thumb = false) => {
  assert.strictEqual(common.wil instanceof Wil, true);
  const bitmap = await common.wil.getBitmap(idx);

  const buff = await bitmap.dumpBmp();

  if (!thumb) {
    return buff.toString('base64');
  }

  const image = await jimp.read(buff);

  const width = image.getWidth();
  const height = image.getHeight();

  let newWidth: number;
  let newHeight: number;
  if (width < 50 && height < 50) {
    newWidth = width;
    newHeight = height;
  } else if (width > height) {
    newWidth = 50;
    newHeight = (height / width) * 50;
  } else {
    newHeight = 50;
    newWidth = (width / height) * 50;
  }

  return (await image.resize(newWidth, newHeight).getBufferAsync(jimp.MIME_PNG)).toString('base64');
});
