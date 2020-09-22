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

client.on('message', msg => {
    if (msg.content === 'test') {
        let embed = multilingualService.getEmbed('example', 'en', {
            EXAMPLE_VARIABLE: 'Example Variable',
        });

        msg.channel.send(embed);
    }
});

client.login(Config.token);
