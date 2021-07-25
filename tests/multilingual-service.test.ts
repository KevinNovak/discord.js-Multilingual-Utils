import { expect } from 'chai';
import path from 'path';
import { MultilingualService } from '../src/multilingual-service';

describe('multilingual service', (): void => {
    let folderPath = path.join(__dirname, './data');
    let multilingualService = new MultilingualService(folderPath);

    it('get embed', (): void => {
        let embed = multilingualService.getEmbed('myCategory.example', 'en', {
            EXAMPLE_VARIABLE: 'Example Variable',
        });
        expect(embed.description).is.equal(
            `This is an example\n\nI can have new lines!\n\nThis is an **Example Variable**!\n\nThis is an example reference!\n\nI can be a single line or have multiple lines!`
        );
    });

    it('get regex', (): void => {
        let regex = multilingualService.getRegex('myCategory.example', 'en');
        expect(regex.toString()).is.equal('/\\b(example|ex)\\b/i');
    });

    it('get ref', (): void => {
        let ref = multilingualService.getRef('myCategory.exampleReference', 'en');
        expect(ref).is.equal(
            `This is an example reference!\n\nI can be a single line or have multiple lines!`
        );
    });
});
