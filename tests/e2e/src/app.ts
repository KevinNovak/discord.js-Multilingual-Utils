import { Client, Intents } from 'discord.js';
import path from 'path';
import { MultilingualService } from '../../../src';

let Config = require('../../../../config/config.json');

let folderPath = path.join(__dirname, '../../../../../data');
let multilingualService = new MultilingualService(folderPath);
let client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as '${client.user.tag}'!`);
});

client.on('messageCreate', async msg => {
    let args = msg.content.split(' ');
    switch (args[0]) {
        case 'testEmbed': {
            let embed = multilingualService.getEmbed('myCategory.example', 'en', {
                EXAMPLE_VARIABLE: 'Example Variable',
                ICON_URL: msg.client.user.avatarURL(),
            });
            await msg.channel.send({ embeds: [embed] });
            return;
        }

        case 'testRegex': {
            let value = args[1];
            if (!value) {
                await msg.channel.send('Please enter a value to test.');
                return;
            }

            let regex = multilingualService.getRegex('myCategory.example', 'en');
            let result = regex.test(args[1]);
            if (result) {
                await msg.channel.send('Value matched!');
                return;
            } else {
                await msg.channel.send('Value did NOT match!');
                return;
            }
        }

        case 'testRef': {
            let ref = multilingualService.getRef('myCategory.exampleReference', 'en');
            await msg.channel.send(ref);
            return;
        }
    }
});

client.login(Config.token);
