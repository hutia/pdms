import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Form, Modal, Input } from 'antd';
import { bindThis } from '../utils';
import { FormComponentProps } from 'antd/lib/form';

interface IProp extends React.Props<any> {
    onOk: (password: string) => void;
    onCancel?: () => void;
}

interface IState extends React.ComponentState {
    visible: boolean;
}

interface IFormProps extends FormComponentProps {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const EditorForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component<IFormProps> {
        render() {
            const {
                visible, onCancel, onOk, form,
            } = this.props;
            const { getFieldDecorator } = form;
            const onKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                    onOk();
                } else if (e.key === 'Esc') {
                    onCancel();
                }
            };
            return (
                <Modal
                    visible={visible}
                    title="请输入密码"
                    okText="确定"
                    okButtonProps={{ icon: 'check' }}
                    onOk={onOk}
                    cancelText="取消"
                    cancelButtonProps={{ icon: 'close' }}
                    onCancel={onCancel}
                >
                    <Form layout="vertical">
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码！' }],
                            })(<Input.Password autoFocus onKeyDown={onKeyDown} />)}
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
            this.props.onOk(values.password);
        });
    }

    saveFormRef(formRef: Form) {
        this.formRef = formRef;
    }

    render() {
        return (
            <EditorForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.onCancel}
                onOk={this.onOk}
            />
        );
    }


}

export function promptPassword(): Promise<string | null> {
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
        const onOk = (s: string) => {
            resolve(s);
            destory();
        };
        ReactDOM.render(<DocEditor
            onCancel={onCancel}
            onOk={onOk}
        />, container);
    });
}