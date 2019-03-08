import * as React from 'react';
import { Input, Button, Icon } from 'antd';
import { InputProps } from 'antd/lib/input';

interface IProp extends InputProps {
    onOk: (value: string) => Promise<void>;
    onCancel?: () => void;
}

interface IState extends React.ComponentState {
    busy?: boolean;
}

export default class InlineEditor extends React.Component<IProp, IState> {

    ref: React.RefObject<Input> = React.createRef();

    constructor(props: IProp) {
        super(props);
        this.state = {
        };
        this.onKeyDown = this.onKeyDown.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            this.submit();
        } else if (e.keyCode === 27) {
            this.cancel();
        }
    }

    submit() {
        if (this.ref.current) {
            const val = this.ref.current.input.value;
            this.setState({ busy: true }, async () => {
                await this.props.onOk(val);
                this.setState({ busy: false }, () => this.reset());
            });
        }
    }

    cancel() {
        if (this.props.onCancel) { this.props.onCancel(); }
        this.reset();
    }

    reset() {
        if (this.ref.current) {
            this.ref.current.input.value = typeof this.props.defaultValue === 'string' ? this.props.defaultValue : '';
        }
    }

    render() {
        const { onOk, onCancel, ...restProps } = this.props;
        const suffix = onCancel ? (
            <Button.Group size="small">
                <Button icon="check" type="primary" onClick={this.submit} />
                <Button icon="close" onClick={this.cancel} />
            </Button.Group>) : (
                <Button icon="check" size="small" type="primary" onClick={this.submit} />
            );
        if (this.state.busy) {
            return (
                <Input {...restProps} disabled={true} prefix={<Icon type="loading" />} />
            );
        }
        return (
            <Input {...restProps}
                ref={this.ref}
                onKeyDown={this.onKeyDown}
                prefix={<Icon type="edit" />}
                suffix={suffix}
            />
        );
    }
}