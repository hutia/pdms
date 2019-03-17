import * as React from 'react';
import * as marked from 'marked';
import * as api from '../api';
import { IDoc } from '../store/Doc';
import { PageHeader, Typography, Tag, Form, Input, message, Button } from 'antd';
import { bindDeferThis } from '../utils';
import DocIcon from '../components/DocIcon';
import { FormComponentProps } from 'antd/lib/form';

const { Paragraph } = Typography;

interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    data: IDoc | null;
}

interface IFormProps extends FormComponentProps {
    onOk: (password: string) => void;
}

interface IDocProps extends React.Props<any> {
    doc: IDoc;
}

const PasswordForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component<IFormProps> {
        render() {
            const { onOk, form } = this.props;
            const onClick = () => {
                form.validateFields((err, values) => {
                    if (err) { return; }
                    onOk(values.password);
                });
            };
            const onKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                    onClick();
                }
            };
            return (
                <Form layout="inline">
                    <Form.Item label="密码">
                        {form.getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码！' }],
                        })(<Input.Password autoFocus onKeyDown={onKeyDown} />)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={onClick}>确定</Button>
                    </Form.Item>
                </Form>
            );
        }
    }
);

function DocContent(props: IDocProps) {
    const { doc } = props;
    switch (doc.contentType) {
        case 'html':
            return <div dangerouslySetInnerHTML={{ __html: doc.content || '' }}></div>;
        case 'markdown':
            return <div dangerouslySetInnerHTML={{ __html: marked(doc.content || '') }}></div>;
        case 'text':
        default:
            return <pre>{doc.content}</pre>;
    }
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
        api.unwatchCurrentId(this.refresh);
        api.unwatchSelect(this.refresh);
    }

    async refresh() {
        const data = await api.getDocInView();
        this.setState({ data: data && Object.assign({}, data) || null });
    }

    render() {
        const { data } = this.state;

        if (!data) {
            return <PageHeader title="请选择需要查看的项目" />;
        }

        const checkPass = (p: string) => {
            const [ok, nd] = api.unsealPassword(data, p);
            if (!ok) {
                message.error('密码错误！');
                return;
            }
            nd.password = undefined;
            this.setState({ data: nd });
        };

        return (<div>
            <PageHeader
                title={<a onClick={() => api.navDoc(data)}>
                    <DocIcon type={data.icon} size="small" style={{ marginRight: '10px' }} />
                    {data.name}
                </a>}
                subTitle={data.description}
                onBack={api.navUp}
                tags={data.tags && data.tags.map<Tag>(name => <Tag>{name}</Tag> as any) || undefined}
                extra={[
                    <Button icon="edit" onClick={() => api.editDoc(data)}>编辑</Button>,
                    <Button icon="delete" type="danger" onClick={api.removeSelectedDocs} >删除</Button>,
                ]}
            />
            <Paragraph style={{ margin: '10px 50px' }}>
                {data.password ? <PasswordForm onOk={checkPass} /> : <DocContent doc={data} />}
            </Paragraph>
        </div>);

    }
}