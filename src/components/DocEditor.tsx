import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IDoc } from '../store/Doc';
import { ICON_NAMES } from '../icons';
import { Form, Modal, Input, Select } from 'antd';
import { bindThis } from '../utils';
import { FormComponentProps } from 'antd/lib/form';
import DocIcon from './DocIcon';

interface IProp extends React.Props<any> {
    data: IDoc;
    onOk: (d: IDoc) => void;
    onCancel?: () => void;
}

interface IState extends React.ComponentState {
    visible: boolean;
}

interface IFormProps extends FormComponentProps {
    data: IDoc;
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const EditorForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component<IFormProps> {
        render() {
            const {
                data, visible, onCancel, onOk, form,
            } = this.props;
            const { getFieldDecorator, getFieldValue } = form;
            return (
                <Modal
                    visible={visible}
                    title="编辑"
                    okText="保存"
                    okButtonProps={{ icon: 'edit' }}
                    onOk={onOk}
                    cancelText="取消"
                    cancelButtonProps={{ icon: 'close' }}
                    onCancel={onCancel}
                >
                    <Form layout="vertical">
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
                        <Form.Item label="内容">
                            {getFieldDecorator('content', {
                                initialValue: data.content,
                            })(<Input.TextArea autosize />)}
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
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                initialValue: data.password,
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
                                initialValue: data.password,
                            })(<Input.Password />)}
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
                    </Form>

                </Modal>
            );
        }
    }
);

export default class DocEditor extends React.Component<IProp, IState> {
    formRef?: Form;

    constructor(props: IProp) {
        super(props);
        this.state = {
            visible: true,
        };
        bindThis(this, 'saveFormRef', 'onCancel', 'onOk');
    }

    onCancel() {
        this.setState({ visible: false });
        this.props.onCancel && this.props.onCancel();
    }

    onOk() {
        if (!this.formRef || !this.formRef.props.form) { return; }
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) { return; }
            this.setState({ visible: false });
            const docLike = Object.assign({}, this.props.data, values);
            delete docLike['password2'];
            this.props.onOk(docLike);
        });
    }

    saveFormRef(formRef: Form) {
        this.formRef = formRef;
    }

    render() {
        return (
            <EditorForm
                wrappedComponentRef={this.saveFormRef}
                data={this.props.data}
                visible={this.state.visible}
                onCancel={this.onCancel}
                onOk={this.onOk}
            />
        );
    }


}

export function showEditor(d: IDoc): Promise<IDoc | null> {
    return new Promise((resolve) => {
        let container: HTMLDivElement | undefined = document.createElement('div');
        document.body.appendChild(container);

        const destory = () => {
            setTimeout(() => {
                container && document.body.removeChild(container);
                container = undefined;
            }, 10);
        };

        const onCancel = () => {
            resolve(null);
            destory();
        };
        const onOk = (nd: IDoc) => {
            resolve(nd);
            destory();
        };
        ReactDOM.render(<DocEditor
            data={d}
            onCancel={onCancel}
            onOk={onOk}
        />, container);
    });
}