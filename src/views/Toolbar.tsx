import * as React from 'react';
import * as api from '../api';
import { Button } from 'antd';
import { bindDeferThis } from '../utils';

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    selectedDocIds: Set<string>;
}

export default class Toolbar extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            ready: false,
            selectedDocIds: new Set(),
        };
        bindDeferThis(this, 'refresh');
    }

    componentDidMount() {
        this.refresh();
        api.watchSelect(this.refresh);
    }

    componentWillUnmount() {
        api.unwatchSelect(this.refresh);
    }

    async refresh() {
        const selectedDocIds = api.getSelectedDocIds();
        this.setState({ selectedDocIds });
    }

    render() {
        const { selectedDocIds } = this.state;
        return (<div onKeyDown={api.onKeyDown}>
            <Button icon="edit"
                disabled={selectedDocIds.size !== 1}
                onClick={api.editSelectedDoc}
            >
                编辑
            </Button>
            <Button icon="delete"
                type="danger"
                disabled={selectedDocIds.size === 0}
                onClick={api.removeSelectedDocs}
            >
                删除
            </Button>
        </div>);

    }
}