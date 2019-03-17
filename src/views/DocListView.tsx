import * as React from 'react';
import * as api from '../api';
import { IDoc } from '../store/Doc';
import { List } from 'antd';
import DocListItem from '../components/DocListItem';
import InlineEditor from '../components/InlineEditor';
import { bindDeferThis } from '../utils';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    list: IDoc[];
}

export default class DocListView extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            list: [],
        };
        bindDeferThis(this, 'refresh');
    }

    componentDidMount() {
        this.refresh();
        api.watchCurrentId(this.refresh);
    }

    componentWillUnmount() {
        api.unwatchCurrentId(this.refresh);
    }

    async refresh() {
        const list = await api.getCurrentChildren();
        const selected = api.getSelectedDocIds();
        if (list.length > 0 && !list.some(doc => selected.has(doc._id))) {
            api.selectDoc(list[0]);
        }
        this.setState({ list });
    }

    render() {
        const { list } = this.state;
        const selectedDocIds = api.getSelectedDocIds();

        const selectDoc = (d: IDoc, ctrl?: boolean, shift?: boolean) => {
            api.selectDoc(d, list, { shift, ctrl });
            this.setState({});
        };

        return (<div onKeyDown={api.onKeyDown}>
            <List
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(doc: IDoc) => (<DocListItem
                    onSelect={selectDoc}
                    onDoubleClick={api.navDoc}
                    data={doc}
                    active={selectedDocIds.has(doc._id)}
                />)}
            >
            </List>
            <InlineEditor onOk={api.createDocUnderCurrent} placeholder="快速添加..." />
        </div>);

    }
}