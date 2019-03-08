import * as React from 'react';
import * as store from '../store';
import { IDoc } from '../store/Doc';
import DocListView from './DocListView';

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
    store.createDocUnderCurrent('test - ' + Math.random());
    const list = await store.children();
    this.setState({ list });
  }

  render() {
    return <DocListView />;
  }
}
