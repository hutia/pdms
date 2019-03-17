import * as React from 'react';
import { IDoc } from '../store/Doc';
import { ICON_NAMES } from '../icons';
import { Form, Input, Select, PageHeader, message, Button, Typography } from 'antd';
import { bindThis, bindDeferThis } from '../utils';
import { FormComponentProps } from 'antd/lib/form';
import DocIcon from '../components/DocIcon';
import * as api from '../api';

const { Paragraph } = Typography;


interface IProp extends React.Props<any> {

}

interface IState extends React.ComponentState {
    data: IDoc | null;
    password?: string;
}

interface IFormProps extends FormComponentProps {
    data: IDoc;
    password?: string;
    onCancel: () => void;
    onOk: () => void;
}

interface IPasswordFormProps extends FormComponentProps {
    onOk: (password: string) => void;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20, offset: 4 },
};


const EditorForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component<IFormProps> {
        render() {
            const {
                data, onCancel, onOk, form, password,
            } = this.props;
            const { getFieldDecorator, getFieldValue } = form;
            return (
                <Form {...formItemLayout}>
                    <Form.Item label="名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入名称！' }],
                            initialValue: data.name,
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="描述">
                        {getFieldDecorator('description', {
                            initialValue: data.description,
                        })(<Input.TextArea autosize />)}
                    </Form.Item>
                    <Form.Item label="数据类型">
                        {getFieldDecorator('contentType', {
                            initialValue: data.contentType,
                        })(<Select>
                            <Select.Option value="text">文本</Select.Option>
                            <Select.Option value="html">HTML</Select.Option>
                            <Select.Option value="markdown">Mark Down</Select.Option>
                            <Select.Option value="image">图像</Select.Option>
                            <Select.Option value="local-file">文件</Select.Option>
                            <Select.Option value="link-fs-file">链接 - 文件</Select.Option>
                            <Select.Option value="link-fs-folder">链接 - 文件夹</Select.Option>
                            <Select.Option value="link-doc">链接 - 项目</Select.Option>
                            <Select.Option value="link-url">URL</Select.Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="图标">
                        {getFieldDecorator('icon', {
                            initialValue: data.icon,
                        })(<Select showSearch
                            filterOption={true}
                            placeholder="选择图标名称"
                        >
                            {ICON_NAMES.map(name => <Select.Option key={name} value={name}>
                                <DocIcon type={name} size="small" style={{ marginRight: '8px' }} />
                                {name}
                            </Select.Option>)}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="内容">
                        {getFieldDecorator('content', {
                            initialValue: data.content,
                        })(<Input.TextArea autosize />)}
                    </Form.Item>
                    <Form.Item label="标签">
                        {getFieldDecorator('tags', {
                            initialValue: data.tags,
                        })(<Select mode="tags"></Select>)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            initialValue: password,
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="重复密码">
                        {getFieldDecorator('password2', {
                            rules: [{
                                validator: (_, value, callback) => {
                                    if (value !== getFieldValue('password')) {
                                        callback('两次密码输入不一致！');
                                    } else {
                                        callback();
                                    }
                                },
                            }],
                            initialValue: password,
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item {...formTailLayout} style={{ textAlign: 'right' }}>
                        <Button icon="close" onClick={onCancel} style={{ marginRight: '10px' }}>取消</Button>
                        <Button icon="save" type="primary" onClick={onOk}>确定</Button>
                    </Form.Item>
                </Form>
            );
        }
    }
);

const PasswordForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component<IPasswordFormProps> {
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

export default class DocEditorView extends React.Component<IProp, IState> {
    formRef?: Form;

    constructor(props: IProp) {
        super(props);
        this.state = {
            data: null,
        };
        bindThis(this, 'saveFormRef', 'onCancel', 'onOk');
        bindDeferThis(this, 'refresh');
    }

    componentDidMount() {
        this.refresh();
        // api.watchEditing(this.refresh);
    }

    componentWillUnmount() {
        // api.unwatchEditing(this.refresh);
    }

    async refresh() {
        const data = await api.getDocInView();
        this.setState({ data: data && Object.assign({}, data) || null });
    }

    onCancel() {
        api.cancelEditDoc();
    }

    onOk() {
        const { data } = this.state;
        if (!this.formRef || !this.formRef.props.form || !data) { return; }
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) { return; }
            this.setState({ visible: false });
            const docLike = Object.assign({}, data, values);
            delete docLike['password2'];
            api.saveEditDoc(docLike);
        });
    }

    saveFormRef(formRef: Form) {
        this.formRef = formRef;
    }

    render() {
        const { data } = this.state;

        if (!data) {
            return <PageHeader title="请选择需要编辑的项目" />;
        }

        const checkPass = (p: string) => {
            const [ok, nd] = api.unsealPassword(data, p);
            if (!ok) {
                message.error('密码错误！');
                return;
            }
            nd.password = undefined;
            this.setState({ data: nd, password: p });
        };

        if (data.password) {
            return (<div>
                <PageHeader
                    title="请输入密码以进行编辑"
                    onBack={this.onCancel}
                    extra={[
                        <Button icon="close" onClick={this.onCancel}>取消</Button>,
                    ]}
                />
                <Paragraph style={{ margin: '10px 50px' }}>
                    <PasswordForm onOk={checkPass} />
                </Paragraph>
            </div>);
        }

        return (<div>
            <PageHeader
                title="编辑"
                onBack={this.onCancel}
                extra={[
                    <Button icon="close" onClick={this.onCancel}>取消</Button>,
                    <Button icon="save" type="primary" onClick={this.onOk}>保存</Button>,
                ]}
            />
            <Paragraph style={{ margin: '10px 50px' }}>
                <EditorForm
                    wrappedComponentRef={this.saveFormRef}
                    data={data}
                    password={this.state.password}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                />
            </Paragraph>
        </div>);

    }
}