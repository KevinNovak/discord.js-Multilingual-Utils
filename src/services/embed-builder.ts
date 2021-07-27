import { EmbedData, FileData } from '../models/file-models';
import { JsonUtils, StringUtils } from '../utils';

import { MessageEmbed } from 'discord.js';

export class EmbedBuilder {
    public static buildEmbeds(fileData: FileData): { [embedName: string]: MessageEmbed } {
        let defaultEmbed = fileData.defaultEmbed
            ? this.buildEmbed(fileData.defaultEmbed)
            : undefined;

        let embeds = {};

        if (fileData.embeds) {
            for (let [categoryName, categoryData] of Object.entries(fileData.embeds)) {
                for (let [embedName, embedData] of Object.entries(categoryData)) {
                    let embed = this.buildEmbed(embedData, defaultEmbed);
                    embeds[`${categoryName}.${embedName}`] = embed;
                }
            }
        }

        return embeds;
    }

    private static buildEmbed(embedData: EmbedData, defaultEmbed?: MessageEmbed): MessageEmbed {
        let embed = new MessageEmbed(defaultEmbed ?? undefined);

        let author = embedData.author;
        if (author?.name) {
            embed.setAuthor(author.name, author.icon, author.url);
        }

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
        if (embed.author?.name) {
            embed.author.name = StringUtils.replaceVariables(embed.author.name, variables);
        }

        if (embed.author?.url) {
            embed.author.url = StringUtils.replaceVariables(embed.author.url, variables);
        }

        if (embed.author?.iconURL) {
            embed.author.iconURL = StringUtils.replaceVariables(embed.author.iconURL, variables);
        }

        if (embed.title) {
            embed.title = StringUtils.replaceVariables(embed.title, variables);
        }

        if (embed.description) {
            embed.description = StringUtils.replaceVariables(embed.description, variables);
        }

        if (embed.thumbnail) {
            embed.thumbnail.url = StringUtils.replaceVariables(embed.thumbnail.url, variables);
        }

        if (embed.image) {
            embed.image.url = StringUtils.replaceVariables(embed.image.url, variables);
        }

        embed.fields.forEach(field => {
            field.name = StringUtils.replaceVariables(field.name, variables);
            field.value = StringUtils.replaceVariables(field.value, variables);
        });

        if (embed.footer?.text) {
            embed.footer.text = StringUtils.replaceVariables(embed.footer.text, variables);
        }

        if (embed.footer?.iconURL) {
            embed.footer.iconURL = StringUtils.replaceVariables(embed.footer.iconURL, variables);
        }

        return embed;
    }
}
