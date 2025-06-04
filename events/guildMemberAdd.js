module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (member.user.bot) return; // Abaikan bot

    const role = member.guild.roles.cache.find(r => r.name === process.env.ROLE_UNVERIFIED);
    if (!role) return console.log(`⚠️ Role ${process.env.ROLE_UNVERIFIED} tidak ditemukan.`);

    try {
      await member.roles.add(role);
      //console.log(`✅ Role ${role.name} diberikan ke ${member.user.tag}`);
    } catch (err) {
      console.error(`❌ Gagal memberi role ke ${member.user.tag}`, err);
    }
  }
};
