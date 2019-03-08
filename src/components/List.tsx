import React, { Component } from 'react';
import { List } from 'antd';
import { IDoc } from '../store/Doc';
import * as store from '../store';
import Icon from './Icon';

interface IProp extends React.Props<any> {
    data: IDoc[];
    onSelect: (d: IDoc) => void;
}

export default function MyList(props: IProp) {
    const click = (d?: IDoc) => () => store.setCurrentId(d ? d.__id : '');
    const Item = (d: IDoc) => (
        <List.Item key={d.__id}>
            <List.Item.Meta
                avatar={<Icon doc={d} />}
                title={<a href="javascript:void(0);">{d.name}</a>}
                description={d.description}
            />
        </List.Item>
    );
    return (
        <List
            itemLayout="horizontal"
            dataSource={props.data}
            renderItem={Item}
        />
    );

}