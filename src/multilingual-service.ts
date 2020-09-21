import { MessageEmbed } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { FileData } from './models/file-models';
import { EmbedBuilder } from './services/embed-builder';
import { JsonUtils, RegexUtils } from './utils';

let Config = require('../config/config.json');

export class MultilingualService {
    private embeds: { [langCode: string]: { [embedName: string]: MessageEmbed } } = {};

    // TODO: Optional "options" object
    constructor(folderPath: string) {
        let fileNames = fs.readdirSync(folderPath);
        for (let fileName of fileNames) {
            // Extract file language code
            let langCode = RegexUtils.extractLangCode(fileName);
            if (!langCode || this.embeds[langCode]) {
                continue;
            }

            // Read File
            let filePath = path.join(folderPath, fileName);
            let fileContents = fs.readFileSync(filePath, 'utf8');

            // Check if file is JSON
            let fileData: FileData;
            try {
                let replacedFileContents = fileContents;
                // Replace up to X levels deep
                for (let i = 0; i < Config.replacementLevels; i++) {
                    let rawFileData: FileData = JSON.parse(replacedFileContents);
                    replacedFileContents = this.replaceRefs(replacedFileContents, rawFileData.refs);
                }
                fileData = JSON.parse(replacedFileContents);
            } catch (error) {
                continue;
            }
            if (!fileData) {
                continue;
            }

            let embeds = EmbedBuilder.buildEmbeds(fileData);
            this.embeds[langCode] = embeds;
        }
    }

    public getEmbed(
        embedName: string,
        langCode: string,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        let embed = this.embeds[langCode]?.[embedName];
        if (!embed) {
            return;
        }

        let newEmbed = new MessageEmbed(embed);

        if (!variables) {
            return newEmbed;
        }

        return this.populateEmbed(newEmbed, variables);
    }

    private replaceRefs(
        input: string,
        refDatas: {
            [refName: string]: string | string[];
        }
    ): string {
        let output = input;
        for (let [refName, refData] of Object.entries(refDatas)) {
            let refRegex = new RegExp(`{{REF:${refName}}}`, 'g');
            let refString = JsonUtils.joinString(refData, true);
            output = output.replace(refRegex, refString);
        }
        return output;
    }

    private populateEmbed(
        embed: MessageEmbed,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        if (embed.title) {
            embed.title = this.replaceVariables(embed.title, variables);
        }

        if (embed.description) {
            embed.description = this.replaceVariables(embed.description, variables);
        }

        for (let [index, field] of embed.fields.entries()) {
            embed.fields[index].name = this.replaceVariables(field.name, variables);
            embed.fields[index].value = this.replaceVariables(field.value, variables);
        }

        if (embed.footer?.text) {
            embed.footer.text = this.replaceVariables(embed.footer.text, variables);
        }

        return embed;
    }

    private replaceVariables(input: string, variables: { [name: string]: string }): string {
        let output = input;
        for (let [varName, varValue] of Object.entries(variables)) {
            let refRegex = new RegExp(`{{${varName}}}`, 'g');
            output = output.replace(refRegex, varValue);
        }
        return output;
    }
}
