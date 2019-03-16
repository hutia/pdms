import * as React from 'react';
import ICON from '../icons';
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';

interface IProp extends AvatarProps {
    type?: string;
}

export default function DocIcon(props: IProp) {
    const { type, ...restProps } = props;
    const src = './icons/' + (type && ICON[type] || 'file.png');
    return (
        <Avatar src={src} {...restProps} />
    );

}