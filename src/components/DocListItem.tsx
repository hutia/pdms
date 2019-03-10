import * as React from 'react';
import { IDoc } from '../store/Doc';
import { overwrite } from '../utils';
import { List } from 'antd';

interface IProp extends React.Props<any> {
    data: IDoc;
    active?: any;
    onSelect?: (d: IDoc, ctrlKey?: boolean, shift?: boolean) => void;
    onDoubleClick?: (d: IDoc) => void;
}

interface IState extends React.ComponentState {
    hover: boolean;
}

const styles: { [key: string]: React.CSSProperties } = {
    'default': {
        'backgroundColor': 'white',
        'cursor': 'pointer',
        'userSelect': 'none',
    },
    'hover': {
        'backgroundColor': '#EEE',
    },
    'active': {
        'backgroundColor': '#BBE0FF',
    },
    'active-hover': {
        'backgroundColor': '#CCEEFF',
    }
}
overwrite(styles, 'default', 'hover');
overwrite(styles, 'default', 'active');
overwrite(styles, 'default', 'active', 'active-hover');

function style(hover: boolean, active: boolean): React.CSSProperties {
    let styleName = 'default';
    if (active) { styleName = hover ? 'active-hover' : 'active'; }
    else { styleName = hover ? 'hover' : 'default'; }
    return styles[styleName]
}

export default class DocListItem extends React.Component<IProp, IState> {

    constructor(props: IProp) {
        super(props);
        this.state = {
            hover: false,
        };
    }

    render() {
        const { data, active } = this.props;
        const { hover } = this.state;
        const onMouseOver = () => this.setState({ hover: true });
        const onMouseOut = () => this.setState({ hover: false });
        const onClick = (e: React.MouseEvent) => this.props.onSelect && this.props.onSelect(data, e.ctrlKey, e.shiftKey);
        const onDoubleClick = () => this.props.onDoubleClick && this.props.onDoubleClick(data);
        const onKeyDown = (e: React.KeyboardEvent) => {
            e.key === 'Enter' && this.props.onDoubleClick && this.props.onDoubleClick(data);
        }

        return (
            <List.Item
                // actions={actions}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onKeyDown={onKeyDown}
                style={style(hover, active)}
                tabIndex={0}
            >
                <List.Item.Meta
                    title={data.name}
                    description={data.description || ''}
                />
            </List.Item>
        );
    }
}