import { Spin } from 'antd';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

function PreviewImage({ idx }: { idx: number }) {
  if (idx === -1) {
    return (
      <div style={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ background: '#000', width: '100%', paddingBottom: '100%' }}>
        </div>
      </div>
    );
  }

  const [ loading, setLoading ] = useState(true);
  const [ url, setURL ] = useState('');

  useEffect(() => {
    ipcRenderer.invoke('dump-bmp', idx, false).then(ret => {
      const url = `data:image/bmp;base64,${ret}`;
      setURL(url);
      setLoading(false);
    });
  });

  return (
    <Spin spinning={loading}>
      <div style={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ background: '#000', width: '100%', paddingBottom: '100%', backgroundSize: 'contain', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${url})` || 'none' }}>
        </div>
      </div>
    </Spin>
  );
}

export default PreviewImage;
