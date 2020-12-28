export class JsonUtils {
    public static joinString(input: string | string[], escapeNewLine: boolean = false): string {
        if (input instanceof Array) {
            if (escapeNewLine) {
                return input.join('\\n');
            } else {
                return input.join('\n');
            }
        } else {
            return input;
        }
    }
}
