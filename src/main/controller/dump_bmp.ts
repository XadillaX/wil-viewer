import * as assert from 'assert'

import { ipcMain } from 'electron';
import { Wil } from 'wil-parser';
import jimp from 'jimp';
import replaceColor from 'replace-color';

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
  if (width < 100 && height < 100) {
    newWidth = width;
    newHeight = height;
  } else if (width > height) {
    newWidth = 100;
    newHeight = (height / width) * 100;
  } else {
    newHeight = 100;
    newWidth = (width / height) * 100;
  }

  const replaced = await replaceColor({
    image: image,
    colors: {
      type: 'rgb',
      targetColor: [ 0, 0, 0 ],
      replaceColor: [ 0, 0, 0, 0 ],
    },
    deltaE: 0,
  });
  const resized = await replaced.resize(newWidth, newHeight);

  return (await resized.getBufferAsync(jimp.MIME_PNG)).toString('base64');
});
