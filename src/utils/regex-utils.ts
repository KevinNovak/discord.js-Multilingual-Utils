const FILE_NAME_REGEX = /\.([^\s.]+)\.json/i;

export class RegexUtils {
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
