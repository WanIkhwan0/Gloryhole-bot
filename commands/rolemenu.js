const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require('discord.js');
const { infoColor } = require('../config/embed');

module.exports = {
  name: 'rolemenu',
  description: 'Tampilkan dropdown untuk memilih role game',
  async execute(message) {
    if (message.author.id !== process.env.OWNER_ID) {
      return message.reply('Kamu tidak punya izin untuk menggunakan command ini.');
    }

    const mlbbEmoji = '\<:mlbb:1376808143136227389>';
    const racingEmoji = '\<:racingmaster:1376807394637774901>';

    const select = new StringSelectMenuBuilder()
      .setCustomId('role_selector')
      .setPlaceholder('Click Untuk Memilih Roles!')
      .setMinValues(0)
      .setMaxValues(2)
      .addOptions([
        {
          label: 'Mobile Legends',
          value: 'mlbb',
          emoji: mlbbEmoji
        },
        {
          label: 'Racing Master',
          value: 'racing',
          emoji: racingEmoji
        }
      ]);

    const row = new ActionRowBuilder().addComponents(select);

    const embed = new EmbedBuilder()
      .setColor('#e81933')
      .setTitle('**CATALOG GAMES**')
      .setDescription(`
Silahkan pilih roles sesuai dengan **CATALOG GAMES** kamu untuk mengakses channel yang tersedia di bawah ini!

<:mlbb:1376808143136227389> ┃**Mobile Legends**  
<:racingmaster:1376807394637774901> ┃**Racing Master**
`)
      .setImage('https://i.imgur.com/L8hNMuY.png'); // Gambar besar di bawah

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
