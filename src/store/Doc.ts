
export type LinkType = 'fs-file' | 'fs-folder' | 'doc' | 'url';
export type ContentType = 'text' | 'html' | 'markdown' | 'image';

export interface IDoc {
    _id: string;
    name: string;

    content?: string;
    contentType?: ContentType;
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
