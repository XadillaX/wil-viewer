import * as React from 'react'
import { TLShapeUtil, SVGContainer } from '@tldraw/core'
import type { RectShape } from './RectShape'

export const RectComponent = TLShapeUtil.Component<RectShape, SVGSVGElement>(
  ({ shape, events }, ref) => {
    return (
      <SVGContainer ref={ref} {...events}>
        <rect
          width={shape.size[0]}
          height={shape.size[1]}
          stroke={'black'}
          strokeWidth={2}
          strokeLinejoin="round"
          fill="none"
          pointerEvents="all"
        />
      </SVGContainer>
    )
  }
)
