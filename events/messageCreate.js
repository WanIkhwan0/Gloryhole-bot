const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { successColor, errorColor, footerText } = require('../config/embed');
require('dotenv').config();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // ===== Command Prefix (.send, .ping, etc) =====
    if (message.content.startsWith('.')) {
      const args = message.content.slice(1).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);

      if (command) {
        try {
          await command.execute(message, args);
        } catch (error) {
          console.error(`[ERROR] Command '${commandName}':`, error);
          const errorEmbed = new EmbedBuilder()
            .setColor(errorColor)
            .setTitle('Terjadi Kesalahan')
            .setDescription('Ada error saat menjalankan command.')
            .setFooter({ text: footerText });

          return message.channel.send({ embeds: [errorEmbed] });
        }
      }
    }

    // ===== Custom Role Handler =====
    if (message.channel.id !== process.env.ROLE_CHANNEL_ID) return;

    const namaMatch = message.content.match(/Nama:\s*(.+)/i);
    const warnaMatch = message.content.match(/Warna:\s*(#(?:[A-Fa-f0-9]{6}))/i);
    const iconMatch = message.content.match(/Icon:\s*(https?:\/\/\S+\.(?:png|jpg|jpeg))/i);

    if (!namaMatch || !warnaMatch) return;

    const roleName = namaMatch[1].trim();
    const roleColor = warnaMatch[1].trim();
    const iconUrl = iconMatch ? iconMatch[1].trim() : null;
    const userId = message.author.id;

    const filePath = './data/customroles.json';
    let customRoles = {};
    if (fs.existsSync(filePath)) {
      customRoles = JSON.parse(fs.readFileSync(filePath));
    }

    if (customRoles[userId]) {
      const embed = new EmbedBuilder()
        .setColor(errorColor)
        .setDescription('❌ Kamu sudah punya custom role. Hapus dulu untuk bisa buat lagi.')
        .setFooter({ text: footerText });
      return message.channel.send({ embeds: [embed] });
    }

    try {
      const roleOptions = {
        name: roleName,
        color: roleColor,
        permissions: [],
        reason: `Custom role dibuat oleh ${message.author.tag}`
      };

      // ⚠️ Belum diaktifkan icon karena butuh boost Level 2
      // roleOptions.icon = iconUrl;

      const newRole = await message.guild.roles.create(roleOptions);
      await message.member.roles.add(newRole);

      // Simpan role ID & icon
      customRoles[userId] = {
        id: newRole.id,
        icon: iconUrl || null
      };
      fs.writeFileSync(filePath, JSON.stringify(customRoles, null, 2));

      const embed = new EmbedBuilder()
        .setColor(successColor)
        .setTitle('✅ Custom Role Berhasil!')
        .setDescription(`Nama: \`${roleName}\`\nWarna: \`${roleColor}\`\n${iconUrl ? `Icon: [Lihat](${iconUrl})` : ''}`)
        .setFooter({ text: footerText });

      message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      const embed = new EmbedBuilder()
        .setColor(errorColor)
        .setTitle('⚠️ Gagal Membuat Role')
        .setDescription('Ada error saat membuat role. Cek izin bot dan posisi role.')
        .setFooter({ text: footerText });

      message.channel.send({ embeds: [embed] });
    }
  }
};
