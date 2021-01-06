const REGEX_REGEX = /^\/(.*)\/([^\/]*)$/;
const FILE_NAME_REGEX = /\.([^\s.]+)\.json/i;

export class RegexUtils {
    public static extractRegex(input: string): RegExp {
        let match = REGEX_REGEX.exec(input);
        if (!match) {
            return;
        }

        return new RegExp(match[1], match[2]);
    }

    public static extractLangCode(input: string): string {
        let langCode = this.findMatch(input, FILE_NAME_REGEX);
        if (!langCode) {
            return;
        }

        return langCode;
    }

    private static findMatch(input: string, regex: RegExp): string {
        let match = regex.exec(input);
        if (match) {
            return match[1];
        }
    }
}
