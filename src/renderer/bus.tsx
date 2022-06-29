import { useState } from 'react';
import uuid from 'uuid-1345';

export enum ImageItemLoadingStatus {
  NotStarted,
  Loading,
  Loaded,
}

export interface IImageItem {
  idx: number;
  base64?: string;
  loading: ImageItemLoadingStatus;
}

class Bus {
  filename: string;
  setFilename: (filename: string) => void;

  picCount: number;
  setPicCount: (picCount: number) => void;

  fileUUID: string;
  setFileUUID: (fileUUID: string) => void;

  imagesList: IImageItem[];
  setImagesList: (imagesList: IImageItem[]) => void;

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

    const [ imagesList, setImagesList ] = useState([]);
    this.imagesList = imagesList;
    this.setImagesList = setImagesList;
  }

  refreshUUID() {
    this.setFileUUID(uuid.v1());
  }

  recacheImagesList(picCount: number) {
    const arr: (null | IImageItem)[] = Array(picCount).fill(null);
    for (let i = 0; i < picCount; i++) {
      arr[i] = {
        idx: i,
        loading: ImageItemLoadingStatus.NotStarted,
      };
    }
    this.setImagesList(arr);
  }
}

export default Bus;
