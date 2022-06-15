import { Button, Col, Descriptions, Divider, Input, Modal, Layout, Row, Spin } from 'antd';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import { useState } from 'react';

import common from './common';
import Grid from './Components/Grid';
import PreviewImage from './Components/PreviewImage';

function App() {
  const [ filename, setFilename ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ count, setCount ] = useState(0);
  const [ selectedIdx, setSelectedIdx ] = useState(-1);
  const [ autoPlay, setAutoPlay ] = useState(false);
  const [ showJumpModal, setShowJumpModal ] = useState(false);
  const [ showExportModal, setShowExportModal ] = useState(false);

  common.setSelectedIdxState(selectedIdx, setSelectedIdx);
  return (
    <Spin spinning={loading}>
      <Layout style={{ height: "100vh" }}>
        <Layout.Sider width="300" theme="light" style={{ padding: '10px' }}>
          <Row>
            <Col span={24}>
              <Input.Group compact>
                <Input
                  style={{ width: 'calc(100% - 90px)' }}
                  readOnly
                  placeholder="请选择文件"
                  value={filename}
                />
                <Button style={{ width: '90px' }} type="primary" onClick={async () => {
                  common.stopPlay();
                  const ret = await ipcRenderer.invoke('open-file') as OpenDialogReturnValue;
                  if (ret.canceled) return;
                  if (!ret.filePaths.length) return;

                  setSelectedIdx(-1);
                  const fn = ret.filePaths[0];
                  setFilename(fn);
                  setLoading(true);
                  const picCount = (await ipcRenderer.invoke('parse-file', fn)) as number;
                  setCount(picCount);
                  setLoading(false);
                  common.cache = new Map();
                }}>选择文件</Button>
              </Input.Group>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '10px' }}>
            <Col span={12}>
              <Button disabled={selectedIdx <= 0} style={{ width: '100%' }} onClick={() => {
                setSelectedIdx(selectedIdx - 1);
                common.stopPlay();
              }}>上一张</Button>
            </Col>
            <Col span={12}>
              <Button disabled={selectedIdx === -1 || selectedIdx >= count - 1} style={{ width: '100%' }} onClick={() => {
                setSelectedIdx(selectedIdx + 1);
                common.stopPlay();
              }}>下一张</Button>
            </Col>

            <div style={{ height: '10px', width: '100%' }} />

            <Col span={12}>
              <Button disabled={autoPlay} style={{ width: '100%' }} onClick={() => {
                common.play(setAutoPlay);
              }}>自动播放</Button>
            </Col>

            <Col span={12}>
              <Button disabled={!autoPlay} style={{ width: '100%' }} onClick={() => {
                common.stopPlay();
              }}>停止播放</Button>
            </Col>

            <div style={{ height: '10px', width: '100%' }} />

            <Col span={12}>
              <Button disabled={!count} style={{ width: '100%' }} onClick={() => {
                setShowJumpModal(true);
              }}>跳转</Button>
              <Modal
                visible={showJumpModal}
                title="跳转"
                okText="确定"
                cancelText="取消"
                onOk={() => {
                  setShowJumpModal(false);
                }}
                onCancel={() => {
                  setShowJumpModal(false);
                }}
              >
                施工中 🚧
              </Modal>
            </Col>

            <Col span={12}>
              <Button disabled={!count} style={{ width: '100%' }} onClick={() => {
                setShowExportModal(true);
              }}>批量导出</Button>
              <Modal
                visible={showExportModal}
                title="批量导出"
                okText="确定"
                cancelText="取消"
                onOk={() => {
                  setShowExportModal(false);
                }}
                onCancel={() => {
                  setShowExportModal(false);
                }}
              >
                施工中 🚧
              </Modal>
            </Col>
          </Row>

          <div style={{ height: '10px', width: '100%' }} />

          <Descriptions bordered title="文件信息" size="small">
            <Descriptions.Item label="图片数">{count ? count : '-'}</Descriptions.Item>
          </Descriptions>
        </Layout.Sider>
        <Layout.Content style={{ padding: '10px' }}>
          <Row>
            <Col span={6}></Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <PreviewImage idx={selectedIdx} />
            </Col>
            <Col span={6}></Col>
          </Row>
          <Divider />
          <div id="hhhh" onClick={() => { setSelectedIdx(-1); }}>
            <Grid selectedIdx={selectedIdx} count={count} filename={filename} />
          </div>
        </Layout.Content>
      </Layout>
    </Spin>
  );
}

export default App;
