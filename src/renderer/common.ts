interface IResizeOptions {
  count: number;
  setHeight: (_: number) => void;
  setCols: (_: number) => void;
}

class Common {
  #resizeOptions: IResizeOptions = {
    count: 0,
    setHeight: () => { /**/ },
    setCols: () => { /**/ },
  };

  #timer: number;
  #selectedIdxState: [ number, (_: number) => void ];
  #playTimer: number;
  #setAutoPlay: (_: boolean) => void;

  cache: Map<number, string> = new Map();

  resize() {
    clearTimeout(this.#timer);
    this.#timer = null;

    const body = document.getElementsByTagName('body')[0];
    const hhhh = document.getElementById('hhhh');
    const ot = hhhh.offsetTop;
    const rest = body.clientHeight - ot;

    const width = hhhh.offsetWidth;
    const height = rest - 10;

    this.#resizeOptions.setHeight(height);

    const cols = Math.floor((width - 2) / 50);

    this.#resizeOptions.setCols(cols);
  }

  constructor() {
    this.#selectedIdxState = [ 0, () => { /**/ } ];
    window.addEventListener('resize', () => {
      if (this.#timer) {
        clearTimeout(this.#timer);
        this.#timer = null;
      }
      setTimeout(this.resize.bind(this), 10);
    });
  }

  setResizeOptions(options: IResizeOptions) {
    this.#resizeOptions = options;
  }

  setSelectedIdxState(selectedIdx: number, setSelectedIdx: (_: number) => void) {
    this.#selectedIdxState = [ selectedIdx, setSelectedIdx ];
  }

  get selectedIdx() {
    return this.#selectedIdxState[0];
  }

  set selectedIdx(idx: number) {
    this.#selectedIdxState[1](idx);
  }

  play(setAutoPlay: (_: boolean) => void) {
    if (this.#playTimer) return;

    setAutoPlay(true);
    this.#setAutoPlay = setAutoPlay;
    const p = () => {
      if (this.selectedIdx === -1) {
        this.selectedIdx = 0;
      } else if (this.selectedIdx >= this.#resizeOptions.count - 1) {
        this.stopPlay();
      } else {
        this.selectedIdx++;
      }
    }

    this.#playTimer = setInterval(p, 100) as unknown as number;
  }

  stopPlay() {
    if (!this.#playTimer) return;
    clearInterval(this.#playTimer);
    this.#playTimer = 0;
    this.#setAutoPlay(false);
  }
}

export default new Common();
