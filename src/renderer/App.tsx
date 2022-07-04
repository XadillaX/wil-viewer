import { Layout } from "antd";

import './App.css';

import Preview from './Components/TLDraw/Preview';
import ThumbnailList from './Components/ThumbnailList';
import Toolbar from './Components/Toolbar';
import { ListCache } from './state/ListCache';
import { ListCacheType } from './lib/ListCache';
import { PreviewOperator } from './state/PreviewOperator';
import { WilFile } from './state/WilFile';
import PreviewInfo from "./Components/PreviewInfo";

const { Content, Header, Sider } = Layout;

function App() {
  return (
    <WilFile.Provider>
      <PreviewOperator.Provider>
        <Layout>
          <Header id="toolbar">
            <Toolbar />
          </Header>
          <Layout>
            <Sider id="left-sider">
              <ListCache.Provider initialState={{ type: ListCacheType.Thumbnail }}>
                <ThumbnailList />
              </ListCache.Provider>
            </Sider>
            <ListCache.Provider initialState={{ type: ListCacheType.Preview }}>
              <Content id="content">
                <Preview />
              </Content>
              <Sider id="right-sider" width={300}>
                <PreviewInfo />
              </Sider>
            </ListCache.Provider>
          </Layout>
        </Layout>
      </PreviewOperator.Provider>
    </WilFile.Provider>
  );
}

export default App;
