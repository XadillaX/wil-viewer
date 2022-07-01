import { Renderer, TLPage, TLPointerInfo, TLPageState, TLShapeUtilsMap } from '@tldraw/core';
import { ipcRenderer } from 'electron';
import ResizeObserver from 'rc-resize-observer';
import { useEffect, useRef, useState } from 'react';

import Bus, { ImageItemLoadingStatus } from '../../bus';
import { ImageUtil, LineUtil, RectUtil, Shape } from './Shapes';

const shapeUtils: TLShapeUtilsMap<Shape> = {
  image: new ImageUtil(),
  line: new LineUtil(),
  rect: new RectUtil(),
}

interface IPreviewProps {
  bus: Bus;
}

const camera = {
  zoom: 1,
};

function Preview({ bus }: IPreviewProps) {
  const [ spacePressed, setSpacePressed ] = useState(false);
  const [ canvasDragging, setCanvasDragging ] = useState(false);
  const [ cursorType, setCursorType ] = useState('default');
  const [ centerOffset, setCenterOffset ] = useState<[ number, number ]>([ 0, 0 ]);
  const [ page, setPage ] = useState<TLPage<Shape>>({
    id: 'page1',
    shapes: {
      x: {
        id: 'x',
        type: 'line',
        parentId: 'page1',
        name: 'x',
        childIndex: 0,
        point: [ 0, -30000000 ],
        pointEnd: [ 0, 30000000 ],
      },
      y: {
        id: 'y',
        type: 'line',
        parentId: 'page1',
        name: 'y',
        childIndex: 0,
        point: [ -30000000, 0 ],
        pointEnd: [ 30000000, 0 ],
      },
    },
    bindings: {},
  });
  const [ pageState, setPageState ] = useState<TLPageState>({
    id: "page",
    selectedIds: [],
    camera: {
      point: [ 0, 0 ],
      zoom: 1,
    },
  });
  const [ dragInfo, setDragInfo ] = useState<TLPointerInfo | null>(null);
  const [ canvasSize, setCanvasSize ] = useState<[ number, number ]>([ 0, 0 ]);
  const [ zoom, setZoom ] = useState(1);

  useEffect(() => {
    if (spacePressed && canvasDragging) {
      setCursorType('grabbing');
      if (dragInfo) {
        setCenterOffset([ centerOffset[0] + dragInfo.delta[0], centerOffset[1] + dragInfo.delta[1] ]);
      }
    } else if (spacePressed) {
      setCursorType('pointer');
    } else {
      setCursorType('default');
    }

    const center = [ canvasSize[0] / 2, canvasSize[1] / 2 ];
    pageState.camera.point = [ (center[0] + centerOffset[0]) / camera.zoom, (center[1] + centerOffset[1]) / camera.zoom ];
    pageState.camera.zoom = zoom;
    setPageState(JSON.parse(JSON.stringify(pageState)));

    if (bus.selectedIdx === -1) {
      delete page.shapes.image;
      return;
    }

    const selectedIdx = bus.selectedIdx;
    const row = bus.realImageList[bus.selectedIdx];
    if (!row) {
      delete page.shapes.image;
      return;
    }

    if (row.preview) {
      const img = {
        id: 'image',
        type: 'image',
        parentId: 'page1',
        name: 'Image',
        childIndex: 1,
        point: [ 0 + row.preview.info.px, 0 + row.preview.info.py ],
        size: [ row.preview.width, row.preview.height ],
        src: `data:image/png;base64,${row.preview.base64}`,
      } as Shape;
      page.shapes.image = img;
      return;
    }

    delete page.shapes.image;
    if (row.previewLoading !== undefined) {
      return;
    }

    row.previewLoading = ImageItemLoadingStatus.LoadingViaAuto;
    ipcRenderer.invoke('dump-bmp', bus.selectedIdx, false).then(async (ret: IDumpBMPResult) => {
      row.preview = ret;
      if (bus.selectedIdx === selectedIdx) {
        bus.setDisplayImageList([ ...bus.realImageList ]);
      }
    }).catch(err => {
      console.error(err);
      delete row.previewLoading;
    });
  }, [
    bus.selectedIdx,
    bus.displayImageList,
    bus.fileUUID,
    zoom,
    spacePressed,
    canvasDragging,
    dragInfo,
    canvasSize,
  ]);

  const divRef = useRef<HTMLDivElement>(null);

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
          const delta: number = (e as any).wheelDeltaY;
          const percent = 0.1 * delta / 120;
          const newZoom = camera.zoom + percent;
          console.log(newZoom);
          if (newZoom < 0.1) {
            return;
          }

          camera.zoom = newZoom;
          setZoom(newZoom);
        }}
      />
    </div>
    </ResizeObserver>
  );
}

export default Preview;
