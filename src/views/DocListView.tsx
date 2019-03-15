import * as React from 'react';
import * as api from '../api';
import { IDoc } from '../store/Doc';
import { List } from 'antd';
import DocListItem from '../components/DocListItem';
import InlineEditor from '../components/InlineEditor';
import { bindThis } from '../utils';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    ready: boolean;
    list: IDoc[];
}

export default class DocListView extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            ready: false,
            list: [],
        };
        bindThis(this, 'refresh');
    }

    componentDidMount() {
        this.refresh();
        api.watchCurrentId(this.refresh);
    }

    componentWillUnmount() {
        api.unwatchCurrentId(this.refresh);
    }

    refresh() {
        this.setState({ ready: false }, async () => {
            const list = await api.getCurrentChildren();
            this.setState({ ready: true, list });
        });
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
            <InlineEditor onOk={api.createDocUnderCurrent} placeholder="Please input..." />
        </div>);

    }
}