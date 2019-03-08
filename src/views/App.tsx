import React, { Component } from 'react';
import '../theme/App.css';
import * as fs from 'fs';
import EditableText from '../components/EditableText';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
  list: string[];
}

class App extends Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    let list = fs.readdirSync('d:/hutia/code');
    this.setState({ list });
  }

  render() {
    const list = this.state.list.slice();
    const change = (index: number) => async (v: string) => {
      list[index] = v;
      this.setState({ list });
    };
    return list.map((f, index) => <EditableText key={index} text={f} onChange={change(index)} />);
  }
}

export default App;
