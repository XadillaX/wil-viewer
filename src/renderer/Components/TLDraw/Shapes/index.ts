import type { ImageShape } from './Image';
import type { LineShape } from './Line';
import type { RectShape } from './Rect';

export * from './Image';
export * from './Line';
export * from './Rect';

export type Shape = ImageShape | LineShape | RectShape ;
