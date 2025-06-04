const { EmbedBuilder } = require('discord.js');
const { successColor, footerText } = require('../config/embed.js');

module.exports = {
  name: 'ping',
  description: 'Cek latency bot',
  async execute(message) {
    const ping = Date.now() - message.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor(successColor)
      .setTitle('Pong!')
      .setDescription(`**Latency:** \`${ping}ms\``)
      .setFooter({ text: footerText });

    message.channel.send({ embeds: [embed] });
  }
};
