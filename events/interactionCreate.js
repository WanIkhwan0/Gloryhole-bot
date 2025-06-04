module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'role_selector') {
      const roleMap = {
        mlbb: process.env.ROLE_MLBB,
        racing: process.env.ROLE_RACING
      };

      const selected = interaction.values;

      for (const [key, roleId] of Object.entries(roleMap)) {
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) continue;

        const hasRole = interaction.member.roles.cache.has(roleId);
        const selectedThis = selected.includes(key);

        if (selectedThis && !hasRole) {
          await interaction.member.roles.add(role);
        } else if (!selectedThis && hasRole) {
          await interaction.member.roles.remove(role);
        }
      }

      // ⬇️ TARUH DI SINI SETELAH SELECT ROLE DIPROSES
      const roleUnverified = interaction.guild.roles.cache.find(r => r.name === process.env.ROLE_UNVERIFIED);
      const roleMember = interaction.guild.roles.cache.find(r => r.name === process.env.ROLE_MEMBER);

      if (roleUnverified && interaction.member.roles.cache.has(roleUnverified.id)) {
        await interaction.member.roles.remove(roleUnverified);
      }

      if (roleMember && !interaction.member.roles.cache.has(roleMember.id)) {
        await interaction.member.roles.add(roleMember);
      }

      await interaction.deferUpdate(); // Biar gak error interaction failed
    }
  }
};
