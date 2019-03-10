import * as React from 'react';
import { Avatar } from 'antd';
import { IDoc } from '../store/Doc';

interface IProp extends React.Props<any> {
    doc: IDoc;
}

export default function DocIcon(props: IProp) {
    return (
        <Avatar src={props.doc.icon || 'defaultIcon'} />
    );

}