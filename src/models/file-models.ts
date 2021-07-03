import { ColorResolvable } from 'discord.js';

export interface FileData {
    defaultEmbed?: EmbedData;
    embeds?: {
        [categoryName: string]: {
            [embedName: string]: EmbedData;
        };
    };
    regexes?: {
        [categoryName: string]: {
            [regexName: string]: string;
        };
    };
    refs?: {
        [categoryName: string]: {
            [refName: string]: string | string[];
        };
    };
}

export interface EmbedData {
    author?: AuthorData;
    title?: string | string[];
    url?: string;
    thumbnail?: string;
    description?: string | string[];
    fields?: FieldData[];
    image?: string;
    footer?: FooterData;
    timestamp?: boolean;
    color?: ColorResolvable;
}

export interface FieldData {
    name: string | string[];
    value: string | string[];
    inline?: boolean;
}

export interface AuthorData {
    name: string;
    icon?: string;
    url?: string;
}

export interface FooterData {
    text?: string | string[];
    icon?: string;
}
