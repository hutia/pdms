
export type LinkType = 'fs-file' | 'fs-folder' | 'doc' | 'url';

export interface IDoc {
    _id: string;
    name: string;

    content?: string;
    description?: string;
    icon?: string;
    link?: {
        type: LinkType,
        href: string,
    };
    parentId?: string;
    password?: string;
    tags?: string[];
}
