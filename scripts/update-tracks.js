const fs = require('fs');
const path = require('path');

// Read the CSV file and parse team track data
function parseCSV() {
  const csvPath = '/Users/colinlowenberg/Downloads/SensAI Hack Applications - San Francisco 2025 - Team Registration.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');

  const teamTrackData = [];

  // Skip header row and parse data (starting from line 2)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle commas within quotes)
    const columns = parseCSVLine(line);

    if (columns.length < 7) continue; // Skip incomplete rows

    const teamName = columns[0]?.trim();
    const roomNoWithSF = columns[1]?.trim(); // Format: "222-SF08"
    const mainTrack = columns[4]?.trim(); // Column E - Tracks
    const addonTrack = columns[6]?.trim(); // Column G - Add-ons Tracks

    // Skip empty rows or invalid data
    if (!teamName || !roomNoWithSF || teamName === 'Team Name') continue;

    // Extract room number and team number
    const roomMatch = roomNoWithSF.match(/^(\d+)-SF(\d+)$/);
    if (!roomMatch) continue;

    const roomNumber = roomMatch[1];
    const teamNumber = `SF${roomMatch[2]}`;

    // Map CSV track values to our standardized values
    const normalizedMainTrack = normalizeTrack(mainTrack);
    const normalizedAddonTrack = normalizeTrack(addonTrack);

    teamTrackData.push({
      teamName,
      roomNumber,
      teamNumber,
      mainTrack: normalizedMainTrack,
      addonTrack: normalizedAddonTrack,
      originalRoom: roomNoWithSF
    });
  }

  return teamTrackData;
}

// Simple CSV parser that handles quoted values
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current); // Add the last field
  return result;
}

// Normalize track names to match our TRACK_OPTIONS
function normalizeTrack(trackValue) {
  if (!trackValue || trackValue === '') return '';

  const normalized = trackValue.trim().toLowerCase();

  // Map CSV values to our standardized track options
  if (normalized.includes('hand tracking')) {
    return 'Hand Tracking';
  } else if (normalized.includes('immer') || normalized.includes('entertainment')) {
    return 'Immersive Entertainment';
  } else if (normalized.includes('passthrough') || normalized.includes('camera') || normalized.includes('pca')) {
    return 'Passthrough Camera API';
  }

  // Return empty string for unknown or empty tracks
  return '';
}

// Generate update commands for rooms.json
function generateUpdateCommands() {
  const teamData = parseCSV();

  console.log('=== TEAM TRACK DATA FROM CSV ===');
  console.log(`Found ${teamData.length} teams with track data:`);
  console.log('');

  teamData.forEach(team => {
    console.log(`Team: ${team.teamName}`);
    console.log(`  Room: ${team.roomNumber} (${team.teamNumber})`);
    console.log(`  Main Track: "${team.mainTrack}"`);
    console.log(`  Add-on Track: "${team.addonTrack}"`);
    console.log('');
  });

  // Generate API update commands
  console.log('=== API UPDATE COMMANDS ===');
  console.log('You can use these commands to update the rooms via the API:');
  console.log('');

  teamData.forEach(team => {
    if (team.mainTrack || team.addonTrack) {
      const updateData = {
        action: 'updateTracks',
        roomNumber: team.roomNumber,
        teamNumber: team.teamNumber,
        tracks: team.mainTrack,
        addonTracks: team.addonTrack
      };
      console.log(`// Update ${team.teamName} (Room ${team.roomNumber})`);
      console.log(`curl -X POST /api/rooms.json -H "Content-Type: application/json" -d '${JSON.stringify(updateData)}'`);
      console.log('');
    }
  });

  return teamData;
}

// Run the script
if (require.main === module) {
  console.log('Processing SensAI Hack team track data...');
  console.log('');
  generateUpdateCommands();
}

module.exports = { parseCSV, normalizeTrack, generateUpdateCommands };