import { Layout } from "antd";

import './App.css';
import Bus from './bus';
import ThumbnailList from "./Components/ThumbnailList";
import Toolbar from './Components/Toolbar';

const { Content, Header, Sider } = Layout;

function App() {
  const bus = new Bus();

  return (
    <Layout>
      <Header id="toolbar">
        <Toolbar bus={bus} />
      </Header>
      <Layout>
        <Sider id="left-sider">
          <ThumbnailList bus={bus} />
        </Sider>
        <Content id="content">Content</Content>
        <Sider id="right-sider"></Sider>
      </Layout>
    </Layout>
  );
}

export default App;
