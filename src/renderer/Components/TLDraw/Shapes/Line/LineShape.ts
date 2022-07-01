import type { TLShape } from '@tldraw/core'

export interface LineShape extends TLShape {
  type: 'line';
  pointEnd: [ number, number ];
}
