import { MessageEmbed } from 'discord.js';
import path from 'path';

import { FileData } from './models/file-models';
import { EmbedBuilder } from './services/embed-builder';
import { FileUtils, RegexUtils, StringUtils } from './utils';

let Config = require('../config/config.json');

export class MultilingualService {
    private embeds: { [langCode: string]: { [embedName: string]: MessageEmbed } } = {};

    // TODO: Optional "options" object
    constructor(folderPath: string) {
        let fileNames = FileUtils.readFileNames(folderPath);
        for (let fileName of fileNames) {
            // Extract file language code
            let langCode = RegexUtils.extractLangCode(fileName);
            if (!langCode || this.embeds[langCode]) {
                continue;
            }

            let filePath = path.join(folderPath, fileName);
            let fileData = this.getFileData(filePath);
            if (!fileData) {
                continue;
            }

            let embeds = EmbedBuilder.buildEmbeds(fileData);
            this.embeds[langCode] = embeds;
        }
    }

    private getFileData(filePath: string): FileData {
        // Read file
        let fileContents = FileUtils.readFile(filePath);

        // Check if file is JSON
        let fileData: FileData;
        try {
            let replacedFileContents = fileContents;
            // Replace up to X levels deep
            for (let i = 0; i < Config.replacementLevels; i++) {
                let rawFileData: FileData = JSON.parse(replacedFileContents);
                replacedFileContents = StringUtils.replaceRefs(
                    replacedFileContents,
                    rawFileData.refs
                );
            }
            fileData = JSON.parse(replacedFileContents);
        } catch (error) {
            return;
        }

        return fileData;
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

        return EmbedBuilder.populateEmbed(newEmbed, variables);
    }
}
