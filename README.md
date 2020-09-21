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
    "embeds": {
        "example": {
            "title": "Example Embed",
            "description": [
                "This is an example",
                "",
                "I can have new lines!",
                "",
                "This is an **{{EXAMPLE_VARIABLE}}**."
            ],
            "fields": [{ "name": "Example Field", "value": "This is an example field!" }]
        }
    },
    "refs": {
        "exampleTitle": "Example Title!"
    }
}
```

## Example Usage

```typescript
import path from 'path';

import { MultilingualService } from './multilingual-service';

let folderPath = path.join(__dirname, '../lang');
let multilingualService = new MultilingualService(folderPath);

let embed = multilingualService.getEmbed('example', 'en', {
    EXAMPLE_VARIABLE: 'Example Variable!',
});
```
