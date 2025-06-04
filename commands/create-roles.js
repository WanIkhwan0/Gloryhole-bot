const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'create-roles',
  description: 'Buat role custom satu kali saja.',
  async execute(message, args) {
    if (args.length < 2) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff3333')
            .setDescription('Gunakan: `.create-roles <NamaRole> <WarnaHex>`\nContoh: `.create-roles ShadowClan #ff8800`')
        ]
      });
    }

    const color = args[args.length - 1];
    const roleName = args.slice(0, -1).join(' ');

    const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
    if (!hexColorRegex.test(color)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff3333')
            .setDescription('Warna hex tidak valid. Contoh: `#00ffcc`, `#123abc`')
        ]
      });
    }

    const hasCustom = message.member.roles.cache.find(role =>
      role.name !== '@everyone' &&
      role.editable &&
      !role.managed
    );

    if (hasCustom) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff3333')
            .setDescription('Kamu sudah punya custom role.\nHapus dulu role sebelumnya untuk membuat baru.')
        ]
      });
    }

    try {
      const role = await message.guild.roles.create({
        name: roleName,
        color: color,
        reason: `Custom role by ${message.author.tag}`,
        permissions: []
      });

      await message.member.roles.add(role);

      const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(`Nama: ${roleName}\nWarna: ${color}`);

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff3333')
            .setDescription('Terjadi kesalahan saat membuat role.')
        ]
      });
    }
  }
};
