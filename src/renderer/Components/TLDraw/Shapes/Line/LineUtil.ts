import { TLBounds, TLShapeUtil } from '@tldraw/core';
import { LineComponent } from './LineComponent';
import { LineIndicator } from './LineIndicator';
import type { LineShape } from './LineShape';

type T = LineShape;
type E = SVGSVGElement;

export class LineUtil extends TLShapeUtil<T, E> {
  Component = LineComponent;
  Indicator = LineIndicator;

  getBounds = (shape: T) => {
    const bounds: TLBounds = {
      minX: Math.min(shape.point[0], shape.pointEnd[0]),
      maxX: Math.max(shape.point[0], shape.pointEnd[0]),
      minY: Math.min(shape.point[1], shape.pointEnd[1]),
      maxY: Math.max(shape.point[1], shape.pointEnd[1]),
      width: Math.abs(shape.point[0] - shape.pointEnd[0]),
      height: Math.abs(shape.point[1] - shape.pointEnd[1]),
    } as TLBounds;
    return bounds;
  }
}
