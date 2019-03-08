import * as React from 'react';
import { IDoc } from '../store/Doc';

interface IProp extends React.Props<any> {
    data: IDoc;
    onSelect?: (d: IDoc) => void;
}

export default class DocListItem extends React.Component<IProp> {

    constructor(props: IProp) {
        super(props);
    }

    render() {
        const { data } = this.props;
        return (
            <div>{data.name}</div>
        );
    }
}