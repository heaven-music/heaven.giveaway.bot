require('dotenv').config();
const express = require('express');
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events,
  EmbedBuilder
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const TOKEN = process.env.TOKEN;
const PORT = 3000;

// Emoji map 🇦 to 🇹
const emojiMap = [
  '🇦','🇧','🇨','🇩','🇪',
  '🇫','🇬','🇭','🇮','🇯',
  '🇰','🇱','🇲','🇳','🇴',
  '🇵','🇶','🇷','🇸','🇹'
];

// Build global /poll command with 20 optional choices
const pollCommand = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create a multi-choice or yes/no poll')
  .addStringOption(opt =>
    opt.setName('question')
      .setDescription('Poll question')
      .setRequired(true)
  );

for (let i = 0; i < 20; i++) {
  const letter = String.fromCharCode(97 + i); // a to t
  pollCommand.addStringOption(opt =>
    opt.setName(`choice_${letter}`)
      .setDescription(`Choice ${letter.toUpperCase()}`)
      .setRequired(false)
  );
}

// Register command on bot ready
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: [pollCommand.toJSON()]
    });
    console.log('📤 Slash command registered');
  } catch (err) {
    console.error('❌ Command registration failed:', err);
  }
});

// Handle interaction and generate embed
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'poll') return;

  const question = interaction.options.getString('question');
  const choices = [];

  for (let i = 0; i < 20; i++) {
    const key = `choice_${String.fromCharCode(97 + i)}`;
    const value = interaction.options.getString(key);
    if (value) choices.push({ emoji: emojiMap[i], label: value });
  }

  // Build styled embed
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📊 Poll')
    .setDescription(`**${question}**`)
    .setTimestamp();

  let fieldContent = '';

  if (choices.length >= 2) {
    choices.forEach(c => {
      fieldContent += `\n\n${c.emoji} **${c.label}**`;
    });
  } else {
    fieldContent = `\n\n👍 **Yes**\n\n👎 **No**`;
  }

  embed.addFields({ name: '\u200B', value: fieldContent });

  const reply = await interaction.reply({ embeds: [embed], fetchReply: true });

  if (choices.length >= 2) {
    for (const c of choices) await reply.react(c.emoji);
  } else {
    await reply.react('👍');
    await reply.react('👎');
  }
});

// Keep-alive server
express().get('/', (_, res) => res.send('Bot is online')).listen(PORT, () => {
  console.log(`🌐 Express server running on port ${PORT}`);
});

client.login(TOKEN);
