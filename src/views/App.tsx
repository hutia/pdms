import * as React from 'react';
import DocListView from './DocListView';
import DocPath from './DocPath';
import Toolbar from './Toolbar';
import { Layout } from 'antd';
import DocDetailView from './DocDetailView';
import * as api from '../api';
import { bindDeferThis } from '../utils';
import DocEditorView from './DocEditorView';

const { Header, Content, Footer, Sider } = Layout;

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
  isEditingInView: boolean;
}

export class App extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      isEditingInView: false,
    };
    bindDeferThis(this, 'refresh');
  }

  componentDidMount() {
    this.refresh();
    api.watchEditing(this.refresh);
  }

  componentWillUnmount() {
    api.unwatchEditing(this.refresh);
  }

  async refresh() {
    const isEditingInView = await api.isEditingInView();
    this.setState({ isEditingInView });
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
            {this.state.isEditingInView ? <DocEditorView /> : <DocDetailView />}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>);
  }
}
