
export type ContentType = 'text' | 'html' | 'markdown' | 'image' | 'local-file' | 'link-fs-file' | 'link-fs-folder' | 'link-doc' | 'link-url';

export interface IDoc {
    _id: string;
    name: string;

    content?: string;
    contentType?: ContentType;
    description?: string;
    icon?: string;
    parentId?: string;
    password?: string;
    tags?: string[];
}
