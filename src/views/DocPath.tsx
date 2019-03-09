import * as React from 'react';
import { Breadcrumb, Icon } from 'antd';
import { IDoc } from '../store/Doc';
import * as store from '../store';
import { bindThis } from '../utils';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    ready: boolean;
    list: IDoc[];
}

function clickFactory(d?: IDoc) {
    return () => store.setCurrentId(d ? d._id : '');
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
            ready: false,
            list: [],
        };
        bindThis(this, 'refresh');
    }

    componentDidMount() {
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
            return (<Breadcrumb>
                <Breadcrumb.Item>
                    <Icon type="loading" />
                    Loading...
                </Breadcrumb.Item>
            </Breadcrumb>);
        }
        const { list } = this.state;
        return (<Breadcrumb>
            {itemFactory(undefined, list.length === 0)}
            {list.map((doc, index) => itemFactory(doc, index === list.length - 1))}
        </Breadcrumb>);
    }
}