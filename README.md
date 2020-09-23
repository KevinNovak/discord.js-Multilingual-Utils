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

client.on('message', msg => {
    if (msg.content === 'test') {
        let embed = multilingualService.getEmbed('example', 'en', {
            EXAMPLE_VARIABLE: 'Example Variable',
        });

        msg.channel.send(embed);
    }
});

client.login(Config.token);
```

![Example](https://i.imgur.com/daduqzo.png)
