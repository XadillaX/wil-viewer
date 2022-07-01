import * as React from 'react'
import { TLShapeUtil, SVGContainer } from '@tldraw/core'
import type { LineShape } from './LineShape'

export const LineComponent = TLShapeUtil.Component<LineShape, SVGSVGElement>(
  ({ shape, events }, ref) => {
    return (
      <SVGContainer ref={ref} {...events}>
        <line x1={0} x2={Math.abs(shape.pointEnd[0] - shape.point[0])} y1={0} y2={Math.abs(shape.pointEnd[1] - shape.point[1])} stroke={'white'} opacity={.3} />
      </SVGContainer>
    )
  }
)
