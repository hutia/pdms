import * as React from 'react';
import * as api from '../api';
import { IDoc } from '../store/Doc';
import { PageHeader, Typography, Tag } from 'antd';
import { bindDeferThis } from '../utils';

const { Paragraph } = Typography;

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    data: IDoc | null;
}

export default class DocDetailView extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            data: null,
        };
        bindDeferThis(this, 'refresh');
    }

    componentDidMount() {
        this.refresh();
        api.watchCurrentId(this.refresh);
        api.watchSelect(this.refresh);
    }

    componentWillUnmount() {
        api.watchCurrentId(this.refresh);
        api.watchSelect(this.refresh);
    }

    async refresh() {
        let data = await api.getLastSelectedDoc();
        if (!data) {
            data = await api.getCurrentDoc();
        }
        this.setState({ data });
    }

    render() {
        const { data } = this.state;
        if (!data) {
            return <PageHeader title="请选择需要查看的项目" />;
        }

        return (<div>
            <PageHeader
                title={data.name}
                subTitle={data.description}
                onBack={api.navUp}
                tags={data.tags && data.tags.map<Tag>(name => <Tag>{name}</Tag> as any) || undefined}
            />
            <Paragraph>
                {data.content}
            </Paragraph>
        </div>);

    }
}