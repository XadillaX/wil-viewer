import type { TLShape } from '@tldraw/core'

export interface ImageShape extends TLShape {
  type: 'image';
  size: number[];
  src: string;
}
