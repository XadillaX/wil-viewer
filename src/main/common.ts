import { BrowserWindow } from 'electron';
import { Wil } from 'wil-parser';

class Common {
  #mainWindow: BrowserWindow | undefined = undefined;
  #wil: Wil | undefined = undefined;

  get mainWindow(): BrowserWindow {
    return this.#mainWindow;
  }

  set mainWindow(w: BrowserWindow) {
    this.#mainWindow = w;
  }

  get wil(): Wil {
    return this.#wil;
  }

  set wil(w: Wil) {
    this.#wil = w;
  }
}

export default new Common();
