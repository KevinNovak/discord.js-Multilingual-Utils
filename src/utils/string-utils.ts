import { JsonUtils } from '.';

export class StringUtils {
    public static replaceRefs(
        input: string,
        refDatas: {
            [categoryName: string]: {
                [refName: string]: string | string[];
            };
        }
    ): string {
        let output = input;
        for (let [categoryName, categoryData] of Object.entries(refDatas)) {
            for (let [refName, refData] of Object.entries(categoryData)) {
                let refString = JsonUtils.joinString(refData, true);
                output = this.replaceAll(output, `{{REF:${categoryName}.${refName}}}`, refString);
            }
        }
        return output;
    }

    public static replaceVariables(input: string, variables: { [name: string]: string }): string {
        let output = input;
        for (let [varName, varValue] of Object.entries(variables)) {
            output = this.replaceAll(output, `{{${varName}}}`, varValue);
        }
        return output;
    }

    public static replaceAll(input: string, findText: string, replaceText: string): string {
        let refRegex = new RegExp(findText, 'g');
        return input.replace(refRegex, replaceText);
    }
}
