import React, { Component } from 'react';
import { Input, Icon, Button } from 'antd';

interface IProp extends React.Props<any> {
    text: string;
    onChange: (v: string) => Promise<void>;
}

interface IState extends React.ComponentState {
    mode: 'ready' | 'editing' | 'submiting';
}

export default class EditableText extends Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            mode: 'ready',
        };
    }

    render() {
        const { mode } = this.state;
        let value = this.props.text;
        const startEdit = () => this.setState({ mode: 'editing' });
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            value = e.target.value;
        };
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.keyCode === 13) {
                submitChange();
            } else if (e.keyCode === 27) {
                cancelChange();
            }
        };
        const submitChange = () => {
            this.setState({ mode: 'submiting' }, async () => {
                await this.props.onChange(value);
                this.setState({ mode: 'ready' });
            });
        };
        const cancelChange = () => {
            this.setState({ mode: 'ready' });
        };

        if (mode === 'ready') {
            return <span onClick={startEdit}>{this.props.text}</span>;
        } else if (mode === 'editing') {
            return (<Input.Group compact>
                <Input
                    style={{ width: '80%' }}
                    defaultValue={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <Button type="primary" icon="check" onClick={submitChange} />
                <Button type="default" icon="close" onClick={cancelChange} />
            </Input.Group>);
        } else {
            return <Icon type="loading" />
        }

    }
}