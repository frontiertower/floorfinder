const http = require('http');
const fetch = require('node-fetch');

// Juror names
const jurors = [
  'Juror 1', 'Juror 2', 'Juror 3', 'Juror 4', 'Juror 5',
  'Juror 6', 'Juror 7', 'Juror 8', 'Juror 9', 'Juror 10',
  'Juror 11', 'Juror 12', 'Juror 13', 'Juror 14', 'Juror 15'
];

// Sample project names for teams that don't have them
const projectNames = [
  'VR Hand Tracker', 'AR Navigation', 'Mixed Reality Hub', 'Gesture Control',
  'Spatial Audio', 'Eye Tracking Demo', 'Haptic Feedback', 'Virtual Assistant',
  'AR Art Studio', 'VR Training Sim', 'Mixed Reality Game', 'Hand Gesture UI',
  'Immersive Learning', 'Virtual Workspace', 'AR Shopping', 'VR Meditation',
  'Gesture Recognition', 'Spatial Computing', 'Virtual Collaboration', 'AR Visualization',
  'VR Fitness', 'Mixed Reality Tools', 'Hand Control System', 'Immersive Experience',
  'Virtual Environment', 'AR Interface', 'VR Simulator', 'Gesture Interface',
  'Spatial Interaction', 'Virtual Reality App', 'AR Experience', 'Mixed Reality Demo',
  'Hand Tracking App', 'Immersive Interface', 'Virtual World', 'AR Application',
  'VR Experience', 'Gesture Control App', 'Spatial App', 'Virtual Interface',
  'Mixed Reality Experience'
];

// Generate realistic scores with some variation
function generateScore(baseScore, variation = 2) {
  const score = baseScore + (Math.random() * variation * 2 - variation);
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

// Generate track-specific scores based on the team's tracks
function generateTrackScores(tracks, addonTracks) {
  const scores = {
    passthroughCameraAPI: 0,
    immersiveEntertainment: 0,
    handTracking: 0,
    mrAndVR: 0,
    projectUpgrade: 0
  };

  // Higher scores for tracks the team is participating in
  if (tracks === 'Passthrough Camera API') {
    scores.passthroughCameraAPI = generateScore(7, 2);
  } else {
    scores.passthroughCameraAPI = generateScore(3, 1.5);
  }

  if (tracks === 'Immersive Entertainment' || addonTracks === 'Immersive Entertainment') {
    scores.immersiveEntertainment = generateScore(7, 2);
  } else {
    scores.immersiveEntertainment = generateScore(3, 1.5);
  }

  if (addonTracks === 'Hand Tracking') {
    scores.handTracking = generateScore(7, 2);
  } else {
    scores.handTracking = generateScore(3, 1.5);
  }

  if (tracks === 'MR and VR' || addonTracks === 'MR and VR') {
    scores.mrAndVR = generateScore(7, 2);
  } else {
    scores.mrAndVR = generateScore(3, 1.5);
  }

  if (tracks === 'Project Upgrade' || addonTracks === 'Project Upgrade') {
    scores.projectUpgrade = generateScore(7, 2);
  } else {
    scores.projectUpgrade = generateScore(3, 1.5);
  }

  return scores;
}

// Generate demo scores for all teams
async function generateDemoScores() {
  try {
    console.log('🎯 Generating demo scores for all teams...\n');

    // Get teams from local API
    const teams = await new Promise((resolve, reject) => {
      http.get('http://localhost:9002/api/rooms.json', (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const rooms = JSON.parse(data);
            const teams = rooms.filter(room => room.teamName && room.teamName !== 'N/A' && room.teamName !== '');
            resolve(teams);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject);
    });

    console.log(`📊 Found ${teams.length} teams to score\n`);

    // Generate scores for each juror
    for (const juror of jurors) {
      console.log(`📝 Generating scores for ${juror}...`);

      const ratings = {};

      teams.forEach((team, index) => {
        const teamKey = `${team.name}_${team.teamName}`;

        // Generate project name if not exists
        const projectName = team.projectName || projectNames[index % projectNames.length];

        // Base scores with some realistic variation
        let concept = generateScore(6.5, 2);
        let quality = generateScore(6, 2);
        let implementation = generateScore(6.2, 2);

        // Track-specific scores
        const trackScores = generateTrackScores(team.tracks, team.addonTracks);

        // Boost scores for actual winners and runners up
        const teamName = team.teamName.toLowerCase();
        if (teamName.includes('edgelord')) {
          // Project Upgrade Winner
          concept = generateScore(8.5, 1);
          quality = generateScore(8.7, 1);
          implementation = generateScore(8.3, 1);
          if (team.tracks === 'Project Upgrade') trackScores.projectUpgrade = generateScore(9, 0.5);
        } else if (teamName.includes('staxel')) {
          // Project Upgrade Runner Up
          concept = generateScore(8, 1);
          quality = generateScore(7.8, 1);
          implementation = generateScore(8.1, 1);
          if (team.tracks === 'Project Upgrade') trackScores.projectUpgrade = generateScore(8.5, 0.5);
        } else if (teamName.includes('takeover')) {
          // MR and VR Winner + Hand Tracking Winner
          concept = generateScore(8.8, 1);
          quality = generateScore(8.5, 1);
          implementation = generateScore(8.7, 1);
          if (team.tracks === 'MR and VR') trackScores.mrAndVR = generateScore(9, 0.5);
          if (team.addonTracks === 'Hand Tracking') trackScores.handTracking = generateScore(9, 0.5);
        } else if (teamName.includes('pathfinder')) {
          // MR and VR Runner Up
          concept = generateScore(8.2, 1);
          quality = generateScore(8, 1);
          implementation = generateScore(8.3, 1);
          if (team.tracks === 'MR and VR') trackScores.mrAndVR = generateScore(8.5, 0.5);
        } else if (teamName.includes('thatsmyjam')) {
          // Passthrough Camera API Winner
          concept = generateScore(8.6, 1);
          quality = generateScore(8.3, 1);
          implementation = generateScore(8.8, 1);
          if (team.tracks === 'Passthrough Camera API') trackScores.passthroughCameraAPI = generateScore(9, 0.5);
        } else if (teamName.includes('jae-z') || teamName.includes('jaez')) {
          // Passthrough Camera API Runner Up
          concept = generateScore(8.1, 1);
          quality = generateScore(7.9, 1);
          implementation = generateScore(8.2, 1);
          if (team.tracks === 'Passthrough Camera API') trackScores.passthroughCameraAPI = generateScore(8.5, 0.5);
        } else if (teamName.includes('hygge') || teamName.includes('huggingheart')) {
          // Immersive Entertainment Winner
          concept = generateScore(8.4, 1);
          quality = generateScore(8.6, 1);
          implementation = generateScore(8.2, 1);
          if (team.addonTracks === 'Immersive Entertainment') trackScores.immersiveEntertainment = generateScore(9, 0.5);
        } else if (teamName.includes('demigod')) {
          // Hand Tracking Runner Up
          concept = generateScore(8, 1);
          quality = generateScore(7.8, 1);
          implementation = generateScore(8, 1);
          if (team.addonTracks === 'Hand Tracking') trackScores.handTracking = generateScore(8.5, 0.5);
        }

        // Calculate total
        const total = concept + quality + implementation +
                     trackScores.passthroughCameraAPI +
                     trackScores.immersiveEntertainment +
                     trackScores.handTracking +
                     trackScores.mrAndVR +
                     trackScores.projectUpgrade;

        // Sample notes
        const notes = [
          'Great innovative concept with solid execution.',
          'Strong technical implementation, could use better UX.',
          'Excellent use of the track requirements.',
          'Creative approach to the problem space.',
          'Well-polished demo with good presentation.',
          'Innovative use of hand tracking technology.',
          'Solid foundation, great potential for expansion.',
          'Impressive technical depth and attention to detail.',
          'Creative solution with practical applications.',
          'Well-executed concept with room for improvement.'
        ];

        ratings[teamKey] = {
          teamKey,
          judgeId: juror,
          teamName: team.teamName,
          teamNumber: team.teamNumber || '',
          projectName,
          roomNumber: team.name,
          tracks: team.tracks || '',
          addonTracks: team.addonTracks || '',
          concept,
          quality,
          implementation,
          passthroughCameraAPI: trackScores.passthroughCameraAPI,
          immersiveEntertainment: trackScores.immersiveEntertainment,
          handTracking: trackScores.handTracking,
          mrAndVR: trackScores.mrAndVR,
          projectUpgrade: trackScores.projectUpgrade,
          notes: notes[Math.floor(Math.random() * notes.length)],
          total: Math.round(total * 10) / 10,
          lastUpdated: new Date().toISOString()
        };
      });

      // Save ratings for this juror
      const payload = {
        judgeId: juror,
        ratings
      };

      try {
        const response = await fetch('http://localhost:9002/api/jury-ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
          console.log(`✅ ${juror}: ${result.count} teams scored`);
        } else {
          console.log(`❌ ${juror}: Failed to save scores`);
        }
      } catch (error) {
        console.log(`❌ ${juror}: Error saving scores - ${error.message}`);
      }
    }

    console.log('\n🎉 Demo scores generation completed!');
    console.log(`📈 Generated scores for ${teams.length} teams across ${jurors.length} jurors`);
    console.log(`🔢 Total ratings: ${teams.length * jurors.length}`);

  } catch (error) {
    console.error('Error generating demo scores:', error);
  }
}

// Run the script
if (require.main === module) {
  generateDemoScores();
}

module.exports = { generateDemoScores };