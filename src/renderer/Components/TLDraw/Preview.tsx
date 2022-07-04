import { Renderer, TLPage, TLPointerInfo, TLPageState, TLShapeUtilsMap } from '@tldraw/core';
import ResizeObserver from 'rc-resize-observer';
import { useEffect, useRef, useState } from 'react';
import { ListCache } from '../../state/ListCache';
import { IListCacheItem, ImageLoadStatus } from '../../lib/ListCache';
import { PreviewOperator } from '../../state/PreviewOperator';

import { ImageUtil, LineUtil, RectUtil, Shape } from './Shapes';
import { WilFile } from '../../state/WilFile';

const shapeUtils: TLShapeUtilsMap<Shape> = {
  image: new ImageUtil(),
  line: new LineUtil(),
  rect: new RectUtil(),
}

const empty = 'data:image/webp;base64,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';

function Preview() {
  const wilFile = WilFile.useContainer();
  const previewOperator = PreviewOperator.useContainer();
  const listCache = ListCache.useContainer();
  const divRef = useRef<HTMLDivElement>(null);
  const [ canvasSize, setCanvasSize ] = useState<[ number, number ]>([ 0, 0 ]);
  const [ spacePressed, setSpacePressed ] = useState(false);
  const [ canvasDragging, setCanvasDragging ] = useState(false);
  const [ cursorType, setCursorType ] = useState('default');
  const [ dragInfo, setDragInfo ] = useState<TLPointerInfo | null>(null);
  const [ preview, setPreview ] = useState<IListCacheItem>(null);

  const page: TLPage<Shape> = {
    id: 'preview',
    shapes: {
      x: {
        id: 'coordinate-x',
        type: 'line',
        parentId: 'preview',
        name: 'coordinate-x',
        childIndex: 0,
        point: [ 0, -10000000 ],
        pointEnd: [ 0, 10000000 ],
      },
      y: {
        id: 'coordinate-y',
        type: 'line',
        parentId: 'preview',
        name: 'coordinate-y',
        childIndex: 0,
        point: [ -10000000, 0 ],
        pointEnd: [ 10000000, 0 ],
      },
    },
    bindings: {},
  };

  if (preview && preview.content) {
    page.shapes.img = {
      id: 'preview-image',
      type: 'image',
      parentId: 'preview',
      name: 'preview-image',
      childIndex: 0,
      point: [
        preview.content.info.px,
        preview.content.info.py,
      ],
      src: `data:image/png;base64,${preview.content.base64}`,
      size: [
        preview.content.width,
        preview.content.height,
      ],
    };
  } else if (previewOperator.selectedIdx >= 0) {
    page.shapes.img = {
      id: 'preview-image',
      type: 'image',
      parentId: 'preview',
      name: 'preview-image',
      childIndex: 0,
      point: [ -100, -71 ],
      src: empty,
      size: [ 200, 142 ],
    };
  }

  const pageState: TLPageState = {
    id: "preview",
    selectedIds: [],
    camera: {
      point: [
        (previewOperator.centerOffset[0] + canvasSize[0] / 2) / previewOperator.zoom,
        (previewOperator.centerOffset[1] + canvasSize[1] / 2) / previewOperator.zoom,
      ],
      zoom: previewOperator.zoom,
    },
  };

  useEffect(() => {
    wilFile.setPreviewCache(listCache);
    previewOperator.select(-1);
    setPreview(null);
  }, [ wilFile.fileUUID ]);

  useEffect(() => {
    if (spacePressed && canvasDragging) {
      setCursorType('grabbing');
      if (dragInfo) {
        previewOperator.emitDrag(dragInfo);
      }
    } else if (spacePressed) {
      setCursorType('pointer');
    } else {
      setCursorType('default');
    }
  }, [ spacePressed, canvasDragging, dragInfo ]);

  useEffect(() => {
    if (previewOperator.selectedIdx < 0) {
      setPreview(null);
      return;
    }

    if (previewOperator.selectedPreview.loadState === ImageLoadStatus.Loaded) {
      setPreview(previewOperator.selectedPreview);
      return;
    }

    if (previewOperator.selectedPreview.loadState !== ImageLoadStatus.NotStarted) {
      return;
    }

    const selectedIdx = Number(previewOperator.selectedIdx);
    listCache.load(previewOperator.selectedIdx, ImageLoadStatus.LoadingViaScroll, true).finally(() => {
      if (selectedIdx === previewOperator.selectedIdx) {
        previewOperator.select(previewOperator.selectedIdx);
        setPreview(listCache.listCache.list[previewOperator.selectedIdx]);
      }
    });
  }, [ previewOperator.selectedIdx ]);

  return (
    <ResizeObserver onResize={() => {
      setCanvasSize([ divRef.current!.clientWidth, divRef.current!.clientHeight ]);
    }}>
      <div style={{ width: '100%', height: '100%', cursor: cursorType }} ref={divRef}>
        <Renderer
          hideGrid={false}
          grid={20}
          shapeUtils={shapeUtils}
          page={page}
          pageState={pageState}
          theme={{
            background: '#525659',
          }}
          onKeyDown={(key, info, e) => {
            switch (key) {
              case ' ': setSpacePressed(true); break;
              default: break;
            }
          }}
          onKeyUp={(key, info, e) => {
            switch (key) {
              case ' ': setSpacePressed(false); break;
              default: break;
            }
          }}
          onDragCanvas={(info: TLPointerInfo<'canvas'>, e) => {
            setCanvasDragging(true);
            setDragInfo(info);
          }}
          onReleaseCanvas={() => {
            setCanvasDragging(false);
            setDragInfo(null);
          }}
          onDragShape={(info: TLPointerInfo<'shape'>, e) => {
            setCanvasDragging(true);
            setDragInfo(info);
          }}
          onReleaseShape={() => {
            setCanvasDragging(false);
            setDragInfo(null);
          }}
          onZoom={(info, e) => {
            previewOperator.emitZoom(e);
          }}
        />
      </div>
    </ResizeObserver>
  );
}

export default Preview;
