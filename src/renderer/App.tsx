import { Button, Col, Descriptions, Divider, Input, Layout, message, Row, Spin } from 'antd';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import * as path from 'path-browserify';
import { useState } from 'react';

import common from './common';
import Grid from './Components/Gallery/Grid';
import ExportButton from './Components/Operator/ExportButton';
import JumpButton from './Components/Operator/JumpButton';
import PreviewImage from './Components/Gallery/PreviewImage';
import { getWILFileType } from './util';

function App() {
  const [ filename, setFilename ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ count, setCount ] = useState(0);
  const [ selectedIdx, setSelectedIdx ] = useState(-1);
  const [ autoPlay, setAutoPlay ] = useState(false);

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

                  const fn = ret.filePaths[0];
                  setLoading(true);
                  setSelectedIdx(-1);

                  let picCount;
                  try {
                    picCount = (await ipcRenderer.invoke('parse-file', fn)) as number;
                  } catch (e) {
                    setLoading(false);
                    setFilename('');
                    setCount(0);
                    setSelectedIdx(-1);
                    common.cache = new Map();
                    message.error(e.message);
                    return;
                  }

                  setFilename(fn);
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
              <Button disabled={autoPlay || count === 0} style={{ width: '100%' }} onClick={() => {
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
              <JumpButton count={count} selectedIdx={selectedIdx} />
            </Col>

            <Col span={12}>
              <ExportButton count={count} />
            </Col>
          </Row>

          <div style={{ height: '10px', width: '100%' }} />

          <Descriptions bordered title="文件信息" size="small" column={1}>
            <Descriptions.Item label="WIL 文件">{filename ? path.basename(filename) : '-'}</Descriptions.Item>
            <Descriptions.Item label="资源类型">{filename ? getWILFileType(filename) : '-'}</Descriptions.Item>
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
