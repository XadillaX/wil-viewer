import { Button, Input, InputNumber, message, Modal, Progress } from 'antd';
import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

function ExportButton({ count }: { count: number }) {
  const [ showExportModal, setShowExportModal ] = useState(false);
  const [ min, setMin ] = useState(0);
  const [ max, setMax ] = useState(count - 1);
  const [ maskClosable, setMaskClosable ] = useState(true);
  const [ percent, setPercent ] = useState(0);
  const [ percentStatus, setPercentStatus ] = useState<'normal' | 'success' | 'active' | 'exception'>('normal');
  const [ exportCount, setExportCount ] = useState(0);

  useEffect(() => {
    setMin(0);
    setMax(count - 1);
    setPercent(0);
    setPercentStatus('normal');
  }, [ count ]);

  const exp = async () => {
    if (min < 0 || max > count - 1) {
      message.error(`最大可输入 ${count - 1}。`);
      return;
    }

    if (max < min) {
      message.error(`起始序号不能大于终止序号。`);
      return;
    }

    setPercent(0);
    setPercentStatus('active');
    setMaskClosable(false);
    setExportCount(max - min + 1);
    ipcRenderer.once('export-bmp-canceled', () => {
      ipcRenderer.removeAllListeners('export-bmp-canceled');
      ipcRenderer.removeAllListeners('export-bmp-error');
      ipcRenderer.removeAllListeners('export-bmp-progress');
      ipcRenderer.removeAllListeners('export-bmp-done');
      setPercentStatus('normal');
      setMaskClosable(true);
    });

    ipcRenderer.once('export-bmp-error', (event, errorMessage) => {
      ipcRenderer.removeAllListeners('export-bmp-canceled');
      ipcRenderer.removeAllListeners('export-bmp-error');
      ipcRenderer.removeAllListeners('export-bmp-progress');
      ipcRenderer.removeAllListeners('export-bmp-done');
      message.error(errorMessage);
      setPercentStatus('exception');
      setMaskClosable(true);
    });

    ipcRenderer.on('export-bmp-progress', (event, progress) => {
      console.log(progress, percent, percentStatus, '<<<');
      setPercent(progress);
    });

    ipcRenderer.once('export-bmp-done', (event, filePath) => {
      ipcRenderer.removeAllListeners('export-bmp-canceled');
      ipcRenderer.removeAllListeners('export-bmp-error');
      ipcRenderer.removeAllListeners('export-bmp-progress');
      ipcRenderer.removeAllListeners('export-bmp-done');
      setPercentStatus('success');
      setMaskClosable(true);
      message.success(`导出成功：${filePath}。`);
    });

    ipcRenderer.send('export-bmp', min, max);
  };

  return (
    <>
      <Button
        disabled={!count}
        style={{ width: '100%' }}
        onClick={() => {
          setShowExportModal(true);
        }}
      >
        批量导出
      </Button>
      <Modal
        visible={showExportModal}
        maskClosable={maskClosable}
        closable={maskClosable}
        title="批量导出"
        okButtonProps={{ disabled: !maskClosable }}
        okText="导出"
        cancelButtonProps={{ disabled: !maskClosable }}
        cancelText="取消"
        onOk={exp}
        onCancel={() => {
          setShowExportModal(false);
        }}
      >
        <Input.Group compact>
          <Input
            className="site-input-split"
            style={{
              width: 120,
              borderRight: 0,
              pointerEvents: 'none',
            }}
            placeholder="输入导出范围"
            disabled
          />
          <InputNumber
            style={{ width: 100, textAlign: 'center' }}
            placeholder="起始序号"
            onChange={value => {
              setMin(value);
            }}
            min={0}
            max={max}
            defaultValue={min}
            onPressEnter={exp}
            disabled={!maskClosable}
          />
          <Input
            className="site-input-split"
            style={{
              width: 30,
              borderLeft: 0,
              borderRight: 0,
              pointerEvents: 'none',
            }}
            placeholder="~"
            disabled
          />
          <InputNumber
            className="site-input-right"
            style={{
              width: 100,
              textAlign: 'center',
            }}
            placeholder="终止序号"
            onChange={value => {
              setMax(value);
            }}
            min={min}
            max={count - 1}
            defaultValue={max}
            onPressEnter={exp}
            disabled={!maskClosable}
          />
        </Input.Group>

        <Progress percent={100 * percent / exportCount} status={percentStatus} format={() => {
          return `${percent} / ${exportCount}`;
        }} style={{ width: '80%' }} />
      </Modal>
    </>
  );
}

export default ExportButton;
