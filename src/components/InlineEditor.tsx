import * as React from 'react';
import { Input, Button } from 'antd';
import { InputProps } from 'antd/lib/input';

interface IProp extends InputProps {
    onOk: (value: string) => void;
    onCancel?: () => void;
}

interface IState extends React.ComponentState {
}

export default class DocAdd extends React.Component<IProp, IState> {

    ref: React.RefObject<Input> = React.createRef();

    constructor(props: IProp) {
        super(props);
        this.state = {
        };
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const value = (e.target as HTMLInputElement).value;
        if (e.keyCode === 13) {
            this.props.onOk(value);
        } else if (e.keyCode === 27 && this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        const { onOk, onCancel, ...restProps } = this.props;
        const addonAfter = onCancel ? (
            <Button.Group>
                <Button icon="check" />
                <Button icon="close" />
            </Button.Group>) : (
                <Button icon="check" />
            );
        return (
            <Input {...restProps} ref={this.ref} onKeyDown={this.onKeyDown} addonAfter={addonAfter} />
        );
    }
}