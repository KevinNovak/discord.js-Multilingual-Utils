# discord.js-Multilingual-Utils

[![NPM Version](https://img.shields.io/npm/v/discord.js-multilingual-utils.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-multilingual-utils)
[![discord.js Version](https://img.shields.io/npm/dependency-version/discord.js-multilingual-utils/discord.js)](https://discord.js.org/)
[![Downloads](https://img.shields.io/npm/dt/discord.js-multilingual-utils.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-multilingual-utils)

Multilingual utilities for [discord.js](https://github.com/discordjs/discord.js/).

## Installation

`npm install discord.js-multilingual-utils`

## Importing

```typescript
import { MultilingualService } from 'discord.js-multilingual-utils';
```

## Example Language File

Language files should be named using the language code of their contents. For example:

`lang.en.json`:

```json
{
    "default": {
        "color": "0x0099ff"
    },
    "embeds": {
        "example": {
            "title": "{{REF:exampleTitle}}",
            "description": [
                "This is an example",
                "",
                "I can have new lines!",
                "",
                "This is an **{{EXAMPLE_VARIABLE}}**!",
                "",
                "{{REF:exampleReference}}"
            ],
            "fields": [{ "name": "Example Field", "value": "This is an example field!" }]
        }
    },
    "regexes": {
        "example": "/\\b(example|ex)\\b/i"
    },
    "refs": {
        "exampleTitle": "Example Embed",
        "exampleReference": [
            "This is an example reference!",
            "",
            "I can be a single line or have multiple lines!"
        ]
    }
}
```

## Example Usage

### Code Example

```typescript
import { Client } from 'discord.js';
import { MultilingualService } from 'discord.js-multilingual-utils';
import path from 'path';

let Config = require('../config/config.json');

let folderPath = path.join(__dirname, '../lang');
let multilingualService = new MultilingualService(folderPath);
let client = new Client();

client.on('ready', () => {
    console.log(`Logged in as '${client.user.tag}'!`);
});

client.on('message', async msg => {
    let args = msg.content.split(' ');
    switch (args[0]) {
        case 'testEmbed': {
            let embed = multilingualService.getEmbed('example', 'en', {
                EXAMPLE_VARIABLE: 'Example Variable',
            });
            await msg.channel.send(embed);
            return;
        }

        case 'testRegex': {
            let value = args[1];
            if (!value) {
                await msg.channel.send('Please enter a value to test.');
                return;
            }

            let regex = multilingualService.getRegex('example', 'en');
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
            let ref = multilingualService.getRef('exampleReference', 'en');
            await msg.channel.send(ref);
            return;
        }
    }
});

client.login(Config.token);
```

### Embed Example

![Embed Example](https://i.imgur.com/HVTBtQu.png)

### Regex Example

![Regex Example](https://i.imgur.com/yOn8MqS.png)

### Reference Example

![Reference Example](https://i.imgur.com/a43uxe0.png)
