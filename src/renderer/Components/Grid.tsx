import { useEffect, useState } from 'react';

import common from '../common';
import LazyGridCell from './LazyGridCell';

function Grid({ filename, count, selectedIdx }: { filename: string, count: number, selectedIdx: number }) {
  const [ height, setHeight ] = useState(0);
  const [ cols, setCols ] = useState(0);

  useEffect(() => {
    common.setResizeOptions({
      count,
      setHeight,
      setCols,
    });
    common.resize();
  });
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(
      <LazyGridCell key={`${filename}-${i}`} totalCols={cols} idx={i} selected={selectedIdx === i ? true : false} />
    );

    if ((i + 1) % cols === 0) {
      arr.push(<div style={{ clear: 'both' }} key={`clear-${i}`} />);
    }
  }

  return (
    <div
      tabIndex={100}
      style={{
        background: '#fff',
        width: '100%',
        height: height,
        borderTop: '1px solid #ccc',
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
        overflowY: 'scroll',
        overflowX: 'hidden',
        paddingBottom: '10px',
      }}
      id="grid-wrapper"
      onKeyDown={e => {
        let sel = 0;
        switch (e.code) {
          case 'ArrowRight':
            if (selectedIdx !== -1 && selectedIdx < count - 1) {
              sel = common.selectedIdx + 1;
              common.selectedIdx = sel;
            } else {
              return;
            }
            break;

          case 'ArrowLeft':
            if (selectedIdx !== -1 && selectedIdx > 0) {
              sel = common.selectedIdx - 1;
              common.selectedIdx = sel;
            } else {
              return ;
            }
            break;

          case 'ArrowDown': {
            if (selectedIdx === -1) return;
            sel = selectedIdx + cols;
            if (sel < count) {
              common.selectedIdx = sel;
            } else {
              return;
            }
            break;
          }

          case 'ArrowUp': {
            if (selectedIdx === -1) return;
            sel = selectedIdx - cols;
            if (sel >= 0) {
              common.selectedIdx = sel;
            } else {
              return;
            }
            break;
          }

          default: return;
        }

        common.stopPlay();
        const selectedRow = Math.floor(sel / cols);
        const ele = e.target as HTMLElement;
        const selectedRowTop = 50 * selectedRow - ele.scrollTop;
        const selectedRowBottom = selectedRowTop + 50;

        if (selectedRowTop < 0) {
          ele.scrollTo(0, 50 * selectedRow);
        } else if (selectedRowBottom > ele.clientHeight) {
          ele.scrollTo(0, 50 * (selectedRow + 1) - ele.clientHeight);
        }

        e.preventDefault();
      }}
    >
      {arr}
    </div>
  );
}

export default Grid;
