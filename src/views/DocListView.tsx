import * as React from 'react';
import * as store from '../store';
import { IDoc } from '../store/Doc';
import { Icon } from 'antd';
import DocListItem from '../components/DocListItem';
import InlineEditor from '../components/InlineEditor';

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
        this.refresh = this.refresh.bind(this);
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
            const currentDoc = await store.getCurrentDoc();
            const list = currentDoc ? (await store.parents(currentDoc)) : [];
            this.setState({ ready: true, list: list.reverse() });
        });
    }

    render() {
        if (!this.state.ready) {
            return <Icon type="loading" />;
        }
        const onOk = () => {
            return new Promise<void>((resolve) => {
                setTimeout(resolve, 3000);
            })
        }
        return (<div>
            {this.state.list.map(doc => <DocListItem data={doc} />)}
            <InlineEditor onOk={onOk} placeholder="Please input..." />
        </div>);

    }
}