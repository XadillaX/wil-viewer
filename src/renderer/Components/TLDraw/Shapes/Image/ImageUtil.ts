import { TLBounds, TLShapeUtil } from '@tldraw/core';
import { ImageComponent } from './ImageComponent';
import { ImageIndicator } from './ImageIndicator';
import type { ImageShape } from './ImageShape';

type T = ImageShape;
type E = SVGSVGElement;

export class ImageUtil extends TLShapeUtil<T, E> {
  Component = ImageComponent;
  Indicator = ImageIndicator;

  getBounds = (shape: T) => {
    const [ x, y ] = shape.point;
    const [ width, height ] = shape.size;

    const bounds: TLBounds = {
      minX: x,
      maxX: x + width,
      minY: y,
      maxY: y + height,
      width,
      height,
    } as TLBounds;
    return bounds;
  }
}
