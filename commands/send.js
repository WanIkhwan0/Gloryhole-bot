const { EmbedBuilder } = require('discord.js');
const { successColor, errorColor, footerText } = require('../config/embed');
require('dotenv').config();

module.exports = {
  name: 'send',
  description: 'Kirim pesan embed atau teks biasa berdasarkan izin role',
  async execute(message) {
    if (message.author.bot) return;

    const allowedRoles = [
      process.env.ROLES_OWNER,
      process.env.ADMIN,
      process.env.MODERATOR
    ];

    const userRoleNames = message.member.roles.cache.map(role => role.name);
    const hasPermission = allowedRoles.some(role => userRoleNames.includes(role));

    // 🔍 Debug log (hapus setelah testing)
    if (process.env.DEBUG === 'false') {
  console.log("User roles:", userRoleNames);
  console.log("Allowed roles:", allowedRoles);
  console.log("Has permission?", hasPermission);
}

    if (!hasPermission) {
      const embed = new EmbedBuilder()
        .setColor(errorColor)
        .setTitle('Tidak Diizinkan')
        .setDescription('Kamu tidak punya izin untuk menggunakan perintah ini.')
        .setFooter({ text: footerText });

      return message.channel.send({ embeds: [embed] });
    }

    const allLines = message.content.split('\n');
    const firstLine = allLines[0];
    const isNoEmbed = firstLine.toLowerCase().includes('--noembed');
    const bodyLines = allLines.slice(1).filter(line => line.trim() !== '');

    // === Kirim tanpa embed ===
    if (isNoEmbed) {
      if (!bodyLines.length) {
        return message.channel.send('Isi pesan tidak boleh kosong.');
      }
      return message.channel.send(bodyLines.join('\n'));
    }

    // === Kirim dengan embed ===
    const embed = new EmbedBuilder().setColor(successColor);

    if (firstLine.startsWith('.send ') && bodyLines.length) {
      const title = firstLine.slice(6).trim();
      embed.setTitle(title);
      embed.setDescription(bodyLines.join('\n'));
    } else if (firstLine === '.send' && bodyLines.length) {
      embed.setDescription(bodyLines.join('\n'));
    } else if (firstLine.startsWith('.send ') && !bodyLines.length) {
      const content = firstLine.slice(6).trim();
      embed.setDescription(content);
    } else {
      return message.channel.send('Isi pesan tidak boleh kosong.');
    }

    return message.channel.send({ embeds: [embed] });
  }
};
