const http = require('http');

// Verify the track updates
http.get('http://localhost:9002/api/rooms.json', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const rooms = JSON.parse(data);
      const trackedRooms = rooms.filter(room => room.tracks || room.addonTracks);

      console.log('🎯 Rooms with track data (including new tracks):');

      const trackCounts = {};
      trackedRooms.forEach(room => {
        const tracks = room.tracks || 'No main track';
        const addonTracks = room.addonTracks || 'No add-on track';
        console.log(`✅ ${room.name}: ${tracks} + ${addonTracks}`);

        if (tracks !== 'No main track') trackCounts[tracks] = (trackCounts[tracks] || 0) + 1;
        if (addonTracks !== 'No add-on track') trackCounts[addonTracks] = (trackCounts[addonTracks] || 0) + 1;
      });

      console.log(`\nTrack Distribution:`);
      Object.entries(trackCounts).forEach(([track, count]) => {
        console.log(`  ${track}: ${count} teams`);
      });

      console.log(`\nTotal: ${trackedRooms.length} rooms with track assignments`);

    } catch (error) {
      console.error('Error parsing data:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error fetching data:', error);
});