module.exports = {
  name: 'ready',
  once: true, // Menjalankan hanya sekali saat bot siap
  execute(client) {
    console.log(`Bot aktif sebagai ${client.user.tag}`);

    const statuses = [
      { name: 'Mobile Legends', type: 0 }, // Playing
      { name: 'Lagu Tiktok Viral 2025 - Lagu Inggris Tiktok Viral - Lagu Barat Terbaru 2025', type: 2 }, // Listening to
      { name: '🔴LIVE | MPL ID S11 | Babak Playoffs', type: 3 }, // Watching
      { name: 'Racing Master', type: 0 },  // Playing
    ];

    function updatePresence() {
      const randomIndex = Math.floor(Math.random() * statuses.length);
      const randomStatus = statuses[randomIndex];
      client.user.setPresence({
        activities: [randomStatus],
        status: 'online',
      });
    }

    updatePresence(); // Set status saat awal ready
    setInterval(updatePresence, 60000); // Update status setiap 60 detik
  },
};
