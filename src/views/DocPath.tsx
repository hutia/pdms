import * as React from 'react';
import { Breadcrumb } from 'antd';
import * as api from '../api';
import { IDoc } from '../store/Doc';
import * as store from '../store';
import { bindDeferThis } from '../utils';
import * as status from '../utils/status';

const { CURRENT_ID } = status.STATUS;

interface IProp extends React.Props<any> {
    style: React.CSSProperties;
}

interface IState extends React.ComponentState {
    list: IDoc[];
}

function clickFactory(d?: IDoc) {
    return () => api.navDoc(d);
}

function itemFactory(doc?: IDoc, isLast?: boolean) {
    if (doc && isLast) {
        return (<Breadcrumb.Item key={doc._id}>
            {doc.name}
        </Breadcrumb.Item>);
    } else if (doc) {
        return (<Breadcrumb.Item key={doc._id}>
            <a href="javascript:void(0);" onClick={clickFactory(doc)}>
                {doc.name}
            </a>
        </Breadcrumb.Item>);
    } else if (isLast) {
        return (<Breadcrumb.Item key='root'>
            Root
        </Breadcrumb.Item>);
    } else {
        return (<Breadcrumb.Item key='root'>
            <a href="javascript:void(0);" onClick={clickFactory()}>
                Root
            </a>
        </Breadcrumb.Item>);
    }
}

export default class DocPath extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            list: [],
        };
        bindDeferThis(this, 'refresh');
    }

    componentDidMount() {
        status.watch(CURRENT_ID, this.refresh);
        this.refresh();
    }

    componentWillUnmount() {
        status.unwatch(CURRENT_ID, this.refresh);
    }

    async refresh() {
        const currentDoc = await api.getCurrentDoc();
        const list = currentDoc ? (await store.parents(currentDoc)) : [];
        this.setState({ list: list.reverse() });
    }

    render() {
        const { list } = this.state;
        return (<Breadcrumb {...this.props}>
            {itemFactory(undefined, list.length === 0)}
            {list.map((doc, index) => itemFactory(doc, index === list.length - 1))}
        </Breadcrumb>);
    }
}