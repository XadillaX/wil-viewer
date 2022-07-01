import * as React from 'react'
import { TLShapeUtil, SVGContainer } from '@tldraw/core'
import type { ImageShape } from './ImageShape'

export const ImageComponent = TLShapeUtil.Component<ImageShape, SVGSVGElement>(
  ({ shape, events }, ref) => {
    return (
      <SVGContainer ref={ref} {...events}>
        <image href={shape.src} />
      </SVGContainer>
    )
  }
)
