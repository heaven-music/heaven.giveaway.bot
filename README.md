# Discord Poll Bot

A simple Discord bot that creates polls using slash commands and emoji reactions.

## Features

- Supports `/poll` command
- Up to 20 multiple-choice options (`choice_a` to `choice_t`)
- Defaults to Yes/No if no options provided
- Embed-based poll layout
- Emoji reactions for voting
- Express server for uptime

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Config the `.env` file:
   ```
   TOKEN=your_discord_bot_token
   ```

3. Start the bot:
   ```
   node index.js
   ```

## Files

- `index.js` - Main bot code
- `.env` - Contains your bot token
- `package.json` - Project configuration
- `LICENSE` - MIT License
