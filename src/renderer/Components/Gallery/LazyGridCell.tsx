import { useInView } from 'react-intersection-observer';

import GridCell from './GridCell';
import common from '../../common';

function LazyGridCell({ idx, selected, totalCols }: { idx: number, selected: boolean, totalCols: number }) {
  const { ref, inView } = useInView();

  const col = idx % totalCols;

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{
          float: 'left',
          width: '50px',
          height: '50px',
          background: '#fff',
          borderRight: '1px solid #ccc',
          borderBottom: '1px solid #ccc',
          textAlign: 'center',
          lineHeight: '49px',
          padding: 0,
          margin: 0,
        }}
        onClick={e => {
          common.selectedIdx = idx;
          common.stopPlay();
          e.stopPropagation();
        }}
      >
        {!inView ? '' : <GridCell idx={idx} />}
      </div>
      {selected ? <div style={{ position: 'absolute', top: '0px', left: `${col * 50}px`, width: '50px', height: '50px', border: '2px solid red' }} /> : ''}
    </div>
  );
}

export default LazyGridCell;
