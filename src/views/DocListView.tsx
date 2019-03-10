import * as React from 'react';
import * as store from '../store';
import { IDoc } from '../store/Doc';
import { List } from 'antd';
import DocListItem from '../components/DocListItem';
import InlineEditor from '../components/InlineEditor';
import { bindThis } from '../utils';
import { confirm } from '../utils/dialog';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    ready: boolean;
    list: IDoc[];
    activeDocIds: Set<string>;
}

export default class DocListView extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            ready: false,
            list: [],
            activeDocIds: new Set(),
        };
        bindThis(this, 'refresh');
    }

    componentDidMount() {
        this.refresh();
        store.watchCurrentId(this.refresh);
    }

    componentWillUnmount() {
        store.unwatchCurrentId(this.refresh);
    }


    refresh() {
        this.setState({ ready: false }, async () => {
            const list = await store.getCurrentChildren();
            this.setState({ ready: true, list });
        });
    }

    activeDocs() {
        const { activeDocIds, list } = this.state;
        return list.filter(d => activeDocIds.has(d._id));
    }

    async removeDoc() {
        const docs = this.activeDocs();
        const docNames = docs.slice(0, 5).map(d => '\t' + d.name).join('\r\n') + (docs.length > 5 ? '\r\n......' : '');
        const [confirmed] = await confirm({ message: `确实要删除选定的 ${docs.length} 个项目吗？\r\n${docNames}` });
        if (confirmed !== 0) { return; }
        await store.removeDocs(docs);
        this.refresh();
    }

    render() {
        // if (!this.state.ready) {
        //     return <Icon type="loading" />;
        // }
        const { activeDocIds, list } = this.state;

        const createDoc = (name: string) => {
            if (!name) { return Promise.resolve(null); }
            return store.createDocUnderCurrent(name);
        };

        const selectDoc: (...args: any[]) => void = (d: IDoc, ctrlKey?: boolean, shiftKey?: boolean) => {
            if (ctrlKey || activeDocIds.size === 0) {
                if (activeDocIds.has(d._id)) {
                    const s = new Set(activeDocIds);
                    s.delete(d._id);
                    this.setState({ activeDocIds: s });
                } else {
                    this.setState({ activeDocIds: new Set([...activeDocIds, d._id]) });
                }
            } else if (shiftKey) {
                let lastDocId: string = '';
                for (let id of activeDocIds.values()) { lastDocId = id; }
                if (!lastDocId) { return selectDoc(d); }
                const lastDocIndex = list.findIndex(doc => doc._id === lastDocId);
                const docIndex = list.findIndex(doc => doc._id === d._id);
                if (lastDocIndex === -1) { return selectDoc(d); }
                this.setState({
                    activeDocIds: new Set([
                        ...activeDocIds,
                        ...list.slice(
                            Math.min(docIndex, lastDocIndex),
                            Math.max(docIndex, lastDocIndex) + 1
                        ).map(d => d._id),
                    ])
                });
            } else {
                this.setState({ activeDocIds: new Set([d._id]) });
            }
        }

        const navDoc = (d: IDoc) => store.setCurrentId(d._id);

        const onKeyDown = (e: React.KeyboardEvent) => {
            e.key === 'Delete' && this.removeDoc();
            e.key === 'Backspace' && store.navUp();
        };

        return (<div onKeyDown={onKeyDown}>
            <List
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(doc: IDoc) => (<DocListItem
                    onSelect={selectDoc}
                    onDoubleClick={navDoc}
                    data={doc}
                    active={activeDocIds.has(doc._id)}
                />)}
            >
            </List>
            <InlineEditor onOk={createDoc} placeholder="Please input..." />
        </div>);

    }
}