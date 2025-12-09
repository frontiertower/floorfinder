const http = require('http');

// Get teams from local API
http.get('http://localhost:9002/api/rooms.json', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const rooms = JSON.parse(data);
      const teams = rooms.filter(room => room.teamName && room.teamName !== 'N/A' && room.teamName !== '');

      console.log('Teams available for demo scoring:');
      teams.forEach((team, i) => {
        console.log(`${i + 1}. ${team.teamName} (Room: ${team.name}) - ${team.tracks || 'No track'} + ${team.addonTracks || 'No add-on'}`);
      });
      console.log(`\nTotal: ${teams.length} teams`);

      // Export for use in other scripts
      module.exports = teams;

    } catch (error) {
      console.error('Error parsing data:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error fetching data:', error);
});