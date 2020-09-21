import path from 'path';

import { MultilingualService } from './multilingual-service';

let folderPath = path.join(__dirname, '../lang');
let multilingualService = new MultilingualService(folderPath);

let embed = multilingualService.getEmbed('example', 'en', {
    EXAMPLE_VARIABLE: 'Example Variable!',
});

console.log(embed);
