import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { IDoc } from '../store/Doc';
import * as store from '../store';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    ready: boolean;
    list: IDoc[];
}

export default class MyBreadcrumb extends Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            ready: false,
            list: [],
        };
        this.refresh = this.refresh.bind(this);
        store.watchCurrentId(this.refresh);
        this.refresh();
    }

    componentWillUnmount() {
        store.unwatchCurrentId(this.refresh);
    }

    refresh() {
        this.setState({ ready: false }, async () => {
            const currentDoc = await store.getCurrentDoc();
            const list = currentDoc ? (await store.parents(currentDoc)) : [];
            this.setState({ ready: true, list: list.reverse() });
        });
    }

    render() {
        if (!this.state.ready) {
            return <Breadcrumb>Loading...</Breadcrumb>;
        }
        const click = (d?: IDoc) => () => store.setCurrentId(d ? d.__id : '');
        const Item = (d?: IDoc) => (<Breadcrumb.Item key={d ? d.__id : 'root'}>
            <a href="javascript:void(0);" onClick={click(d)}>
                {d ? d.name : 'Root'}
            </a>
        </Breadcrumb.Item>);
        const list = this.state.list.slice();
        const lastItem = list.pop();
        return (<Breadcrumb>
            {Item()}
            {list.map(Item)}
            {lastItem && Item(lastItem)}
        </Breadcrumb>);

    }
}