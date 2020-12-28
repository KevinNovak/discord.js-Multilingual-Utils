import { MessageEmbed } from 'discord.js';

import { EmbedData, FileData } from '../models/file-models';
import { JsonUtils, StringUtils } from '../utils';

export class EmbedBuilder {
    public static buildEmbeds(fileData: FileData): { [embedName: string]: MessageEmbed } {
        let defaultEmbed = this.buildEmbed(fileData.default);

        let embeds = {};
        for (let [embedName, embedData] of Object.entries(fileData.embeds)) {
            let embed = this.buildEmbed(embedData, defaultEmbed);
            embeds[embedName] = embed;
        }

        return embeds;
    }

    private static buildEmbed(embedData: EmbedData, defaultEmbed?: MessageEmbed): MessageEmbed {
        let embed = new MessageEmbed(defaultEmbed ?? undefined);

        let title = JsonUtils.joinString(embedData.title);
        if (title) {
            embed.setTitle(title);
        }

        let url = embedData.url;
        if (url) {
            embed.setURL(url);
        }

        let thumbnail = embedData.thumbnail;
        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }

        let description = JsonUtils.joinString(embedData.description);
        if (description) {
            embed.setDescription(description);
        }

        let fields = embedData.fields;
        if (fields) {
            for (let field of fields) {
                field.name = JsonUtils.joinString(field.name);
                field.value = JsonUtils.joinString(field.value);
                if (field.inline !== undefined) {
                    embed.addField(field.name, field.value, field.inline);
                } else {
                    embed.addField(field.name, field.value);
                }
            }
        }

        let image = embedData.image;
        if (image) {
            embed.setImage(image);
        }

        let footer = embedData.footer;
        let footerText = JsonUtils.joinString(footer?.text);
        let footerIcon = footer?.icon;
        if (footerText && footerIcon) {
            embed.setFooter(footerText, footerIcon);
        } else if (footerText) {
            embed.setFooter(footerText);
        }

        // TODO: Allow date or number timestamp
        let timestamp = embedData.timestamp;
        if (timestamp) {
            embed.setTimestamp();
        }

        let color = embedData.color;
        if (color) {
            embed.setColor(color);
        }

        return embed;
    }

    public static populateEmbed(
        embed: MessageEmbed,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        if (embed.title) {
            embed.title = StringUtils.replaceVariables(embed.title, variables);
        }

        if (embed.description) {
            embed.description = StringUtils.replaceVariables(embed.description, variables);
        }

        for (let [index, field] of embed.fields.entries()) {
            embed.fields[index].name = StringUtils.replaceVariables(field.name, variables);
            embed.fields[index].value = StringUtils.replaceVariables(field.value, variables);
        }

        if (embed.footer?.text) {
            embed.footer.text = StringUtils.replaceVariables(embed.footer.text, variables);
        }

        return embed;
    }
}
