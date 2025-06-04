const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { successColor, errorColor, footerText } = require('../config/embed');

module.exports = {
  name: 'delete-role',
  description: 'Hapus custom role kamu (jika ada)',
  async execute(message) {
    const userId = message.author.id;
    const filePath = './data/customroles.json';

    if (!fs.existsSync(filePath)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(errorColor)
            .setTitle('⚠️ Tidak Ada Data')
            .setDescription('Kamu belum pernah membuat custom role.')
            .setFooter({ text: footerText })
        ]
      });
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    const roleEntry = data[userId];

    // Bisa format lama (string) atau baru (object)
    const roleId = typeof roleEntry === 'object' ? roleEntry.id : roleEntry;

    if (!roleId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(errorColor)
            .setTitle('⚠️ Tidak Ada Role')
            .setDescription('Kamu tidak memiliki custom role untuk dihapus.')
            .setFooter({ text: footerText })
        ]
      });
    }

    const role = message.guild.roles.cache.get(roleId);
    if (!role) {
      // Role tidak ditemukan, reset data
      delete data[userId];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(errorColor)
            .setTitle('❌ Role Tidak Ditemukan')
            .setDescription('Role kamu sudah tidak ada. Data akan direset.')
            .setFooter({ text: footerText })
        ]
      });
    }

    try {
      await role.delete(`Custom role dihapus oleh ${message.author.tag}`);
      delete data[userId];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(successColor)
            .setTitle('✅ Role Dihapus')
            .setDescription(`Custom role kamu \`${role.name}\` berhasil dihapus.`)
            .setFooter({ text: footerText })
        ]
      });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(errorColor)
            .setTitle('⚠️ Gagal Menghapus Role')
            .setDescription('Bot tidak bisa menghapus role kamu. Mungkin role tersebut lebih tinggi dari bot.')
            .setFooter({ text: footerText })
        ]
      });
    }
  }
};
