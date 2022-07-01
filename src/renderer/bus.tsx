import { ipcRenderer } from 'electron';
import { Scarlet, TaskObject } from 'scarlet-task';
import { useState } from 'react';
import uuid from 'uuid-1345';

export enum ImageItemLoadingStatus {
  NotStarted,
  LoadingViaScroll,
  LoadingViaAuto,
  Loaded,
  Destroyed,
}

export interface IImageItem {
  idx: number;
  base64?: string;
  loading: ImageItemLoadingStatus;

  preview?: IDumpBMPResult;
  previewLoading?: ImageItemLoadingStatus;
}

let realImageList: IImageItem[] = [];
const scarlet = new Scarlet(1);

class Bus {
  filename: string;
  setFilename: (filename: string) => void;

  picCount: number;
  setPicCount: (picCount: number) => void;

  fileUUID: string;
  setFileUUID: (fileUUID: string) => void;

  displayImageList: IImageItem[];
  setDisplayImageList: (images: IImageItem[]) => void;

  selectedIdx: number;
  setSelectedIdx: (selectedIdx: number) => void;

  previewSrc: IDumpBMPResult | null;
  setPreviewSrc: (previewSrc: IDumpBMPResult | null) => void;

  constructor() {
    const [ filename, setFilename ] = useState('');
    this.filename = filename;
    this.setFilename = setFilename;

    const [ picCount, setPicCount ] = useState(0);
    this.picCount = picCount;
    this.setPicCount = setPicCount;

    const [ fileUUID, setFileUUID ] = useState(uuid.v1());
    this.fileUUID = fileUUID;
    this.setFileUUID = setFileUUID;

    const [ displayImageList, setDisplayImageList ] = useState<IImageItem[]>([]);
    this.displayImageList = displayImageList;
    this.setDisplayImageList = setDisplayImageList;

    const [ previewSrc, setPreviewSrc ] = useState<IDumpBMPResult | null>(null);
    this.previewSrc = previewSrc;
    this.setPreviewSrc = setPreviewSrc;

    const [ selectedIdx, setSelectedIdx ] = useState(-1);
    this.selectedIdx = selectedIdx;
    this.setSelectedIdx = setSelectedIdx;
  }

  refreshUUID() {
    this.setFileUUID(uuid.v1());
  }

  get realImageList() {
    return realImageList;
  }

  async loadThumbnailViaAuto(to: TaskObject<{ idx: number, fileUUID: string }>) {
    const { task } = to;
    const row = this.realImageList[task.idx];
    if (!row || this.fileUUID !== task.fileUUID || row.loading !== ImageItemLoadingStatus.NotStarted) {
      return to.done();
    }

    let ret: IDumpBMPResult;
    try {
      ret = await ipcRenderer.invoke('dump-bmp', task.idx, true);
    } catch (e) {
      if (this.fileUUID !== task.fileUUID) {
        return to.done();
      }

      row.loading = ImageItemLoadingStatus.NotStarted;
      this.setDisplayImageList([ ...this.realImageList ]);

      console.error(e);
      return to.done();
    }

    if (this.fileUUID !== task.fileUUID) {
      return to.done();
    }

    row.loading = ImageItemLoadingStatus.Loaded;
    row.base64 = `data:image/png;base64,${ret.base64}`;

    const id = `thumb-idx-${task.idx}`;
    if (document.querySelector(`#${id}`)) {
      this.setDisplayImageList([ ...this.realImageList ]);
    }

    to.done();

  }

  recacheImagesList(picCount: number) {
    realImageList = [];

    for (let i = 0; i < picCount; i++) {
      realImageList.push({
        idx: i,
        loading: ImageItemLoadingStatus.NotStarted,
      });

      // TODO(XadillaX): improve this.
      // scarlet.push({ idx: i, fileUUID: this.fileUUID }, this.loadThumbnailViaAuto.bind(this));
    }

    this.setDisplayImageList(JSON.parse(JSON.stringify(this.realImageList)));
    this.setPreviewSrc(null);
    this.setSelectedIdx(-1);
  }
}

export default Bus;
