import * as React from 'react';
import * as store from '../store';
import { IDoc } from '../store/Doc';
import DocListView from './DocListView';
import DocPath from './DocPath';
import Toolbar from './Toolbar';
import { Layout } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
  list: IDoc[];
}

export class App extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      list: [],
    };
  }

  async componentDidMount() {
    const list = await store.children();
    this.setState({ list });
  }

  render() {
    return (<Layout>
      <Header>
        <div style={{ width: '120px', height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px 24px 16px 0', float: 'left' }}>
        </div>
        <Toolbar />
      </Header>
      <DocPath style={{ padding: '16px 50px' }} />
      <Layout>
        <Sider theme="light">
          <DocListView />
        </Sider>
        <Layout>
          <Content style={{ margin: '0px 10px 0px 10px', backgroundColor: 'white' }}>
            COntent
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>);
  }
}
