const { parseCSV } = require('./update-tracks');

// Apply the track updates to the database
async function applyTrackUpdates() {
  const teamData = parseCSV();

  console.log(`\n🚀 Applying track updates for ${teamData.length} teams...\n`);

  // Create bulk update payload
  const updates = teamData
    .filter(team => team.mainTrack || team.addonTrack) // Only teams with tracks
    .map(team => ({
      roomNumber: `${team.roomNumber}-${team.teamNumber}`, // Match full room name format like "222-SF08"
      teamNumber: team.teamNumber,
      tracks: team.mainTrack,
      addonTracks: team.addonTrack
    }));

  console.log(`📊 Found ${updates.length} teams with track data to update:`);
  updates.forEach((update, i) => {
    console.log(`${i + 1}. Room ${update.roomNumber} (${update.teamNumber}): "${update.tracks}" + "${update.addonTracks}"`);
  });

  const payload = {
    action: 'bulkUpdateTracks',
    updates: updates
  };

  try {
    console.log('\n⏳ Sending bulk update request...');

    const response = await fetch('http://localhost:9002/api/rooms.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      console.log(`\n✅ Success! Updated tracks for ${result.updatedCount} teams`);

      if (result.results) {
        console.log('\n📋 Update Results:');
        result.results.forEach(r => {
          const status = r.success ? '✅' : '❌';
          console.log(`${status} Room ${r.room}: ${r.message}`);
        });
      }
    } else {
      console.error('❌ Update failed:', result);
    }

  } catch (error) {
    console.error('❌ Error applying updates:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:9002');

    // Show the curl commands as backup
    console.log('\n🔧 Alternative: Use these individual curl commands:');
    updates.forEach(update => {
      const singlePayload = {
        action: 'updateTracks',
        ...update
      };
      console.log(`curl -X POST http://localhost:9002/api/rooms.json -H "Content-Type: application/json" -d '${JSON.stringify(singlePayload)}'`);
    });
  }
}

// Run the script
if (require.main === module) {
  applyTrackUpdates();
}

module.exports = { applyTrackUpdates };