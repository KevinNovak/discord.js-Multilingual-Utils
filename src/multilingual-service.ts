import { MessageEmbed } from 'discord.js';
import path from 'path';

import { FileData } from './models/file-models';
import { EmbedBuilder } from './services/embed-builder';
import { FileUtils, JsonUtils, RegexUtils, StringUtils } from './utils';

export class MultilingualService {
    private internalDatas: {
        [langCode: string]: {
            embeds: {
                [embedName: string]: MessageEmbed;
            };
            regexes: {
                [regexName: string]: RegExp;
            };
            refs: {
                [refName: string]: string;
            };
        };
    } = {};

    // TODO: Optional "options" object
    constructor(folderPath: string, private replacementLevels = 10) {
        let fileNames = FileUtils.readFileNames(folderPath);
        for (let fileName of fileNames) {
            // Extract file language code
            let langCode = RegexUtils.extractLangCode(fileName);
            if (!langCode || this.internalDatas[langCode]) {
                continue;
            }

            let filePath = path.join(folderPath, fileName);
            let rawFileData = this.getFileData(filePath);
            if (!rawFileData) {
                continue;
            }

            let internalData = { embeds: {}, regexes: {}, refs: {} };

            internalData.embeds = EmbedBuilder.buildEmbeds(rawFileData);

            if (rawFileData.refs) {
                for (let [categoryName, categoryData] of Object.entries(rawFileData.refs)) {
                    for (let [refName, refData] of Object.entries(categoryData)) {
                        let ref = JsonUtils.joinString(refData);
                        internalData.refs[`${categoryName}.${refName}`] = ref;
                    }
                }
            }

            if (rawFileData.regexes) {
                for (let [categoryName, categoryData] of Object.entries(rawFileData.regexes)) {
                    for (let [regexName, regexString] of Object.entries(categoryData)) {
                        let regex = RegexUtils.extractRegex(regexString);
                        internalData.regexes[`${categoryName}.${regexName}`] = regex;
                    }
                }
            }

            this.internalDatas[langCode] = internalData;
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
            for (let i = 0; i < this.replacementLevels; i++) {
                let rawFileData: FileData = JSON.parse(replacedFileContents);
                if (rawFileData.refs) {
                    replacedFileContents = StringUtils.replaceRefs(
                        replacedFileContents,
                        rawFileData.refs
                    );
                }
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
        let embed = this.internalDatas[langCode]?.embeds[embedName];
        if (!embed) {
            return;
        }

        let newEmbed = new MessageEmbed(embed);

        if (!variables) {
            return newEmbed;
        }

        return EmbedBuilder.populateEmbed(newEmbed, variables);
    }

    public getRegex(regexName: string, langCode: string): RegExp {
        return this.internalDatas[langCode]?.regexes[regexName];
    }

    public getRef(
        refName: string,
        langCode: string,
        variables?: { [name: string]: string }
    ): string {
        let ref = this.internalDatas[langCode]?.refs[refName];
        if (!ref) {
            return;
        }

        if (!variables) {
            return ref;
        }

        return StringUtils.replaceVariables(ref, variables);
    }
}
