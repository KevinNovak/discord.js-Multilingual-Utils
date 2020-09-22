import { ColorResolvable } from 'discord.js';

export interface FileData {
    default: EmbedData;
    embeds: { [embedName: string]: EmbedData };
    refs: { [refName: string]: string | string[] };
}

export interface EmbedData {
    title: string | string[];
    url: string;
    thumbnail: string;
    description: string | string[];
    fields: FieldData[];
    image: string;
    footer: FooterData;
    timestamp: boolean;
    color: ColorResolvable;
}

export interface FieldData {
    name: string | string[];
    value: string | string[];
    inline: boolean;
}

export interface FooterData {
    text: string | string[];
    icon: string;
}
