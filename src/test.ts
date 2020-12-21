import { Client } from 'discord.js';
import path from 'path';

import { MultilingualService } from './multilingual-service';

let Config = require('../config/config.json');

let folderPath = path.join(__dirname, '../lang');
let multilingualService = new MultilingualService(folderPath);
let client = new Client();

client.on('ready', () => {
    console.log(`Logged in as '${client.user.tag}'!`);
});

client.on('message', async msg => {
    if (msg.content === 'test') {
        let embed = multilingualService.getEmbed('example', 'en', {
            EXAMPLE_VARIABLE: 'Example Variable',
        });
        await msg.channel.send(embed);

        let ref = multilingualService.getRef('exampleReference', 'en');
        await msg.channel.send(ref);
    }
});

client.login(Config.token);
