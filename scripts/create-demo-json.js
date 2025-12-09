const fs = require('fs');

// Sample teams data (simplified version)
const teams = [
  { teamName: 'Edgelord', tracks: 'Project Upgrade', addonTracks: '', name: '700-SF13' },
  { teamName: 'Staxel', tracks: 'Project Upgrade', addonTracks: '', name: '217-SF04' },
  { teamName: 'TakeOver', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '1600-SF22' },
  { teamName: 'PathfinderXR', tracks: 'MR and VR', addonTracks: '', name: '218-SF05' },
  { teamName: 'ThatsMyJam', tracks: 'Passthrough Camera API', addonTracks: 'Hand Tracking', name: '1201-SF17' },
  { teamName: 'JAE-Z', tracks: 'Passthrough Camera API', addonTracks: 'Hand Tracking', name: '700-SF15' },
  { teamName: 'Hygge', tracks: '', addonTracks: 'Immersive Entertainment', name: '1601-SF21' },
  { teamName: 'Don\'t Spark XR', tracks: 'Passthrough Camera API', addonTracks: 'Hand Tracking', name: '214-SF02' },
  { teamName: 'StreamXR', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '215-SF03' },
  { teamName: 'SoundTrick', tracks: 'Passthrough Camera API', addonTracks: '', name: '219-SF29' },
  { teamName: 'Mavericks', tracks: '', addonTracks: 'Immersive Entertainment', name: '221-SF06' },
  { teamName: 'Unsubtle', tracks: 'Passthrough Camera API', addonTracks: 'Hand Tracking', name: '222-SF08' },
  { teamName: 'Biaz', tracks: 'Passthrough Camera API', addonTracks: '', name: '223-SF07' },
  { teamName: 'Redxam', tracks: '', addonTracks: '', name: '213-SF01' },
  { teamName: 'Vamos', tracks: 'Passthrough Camera API', addonTracks: '', name: '700-SF11' },
  { teamName: 'Brookside', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '700-SF12' },
  { teamName: 'Steezmont', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '700-SF14' },
  { teamName: 'Spacebot', tracks: 'Passthrough Camera API', addonTracks: '', name: '1201-SF26' },
  { teamName: 'djLoopXR', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '1206-SF16' },
  { teamName: 'Holodraft', tracks: 'MR and VR', addonTracks: '', name: '1201-SF28' },
  { teamName: 'Alive', tracks: '', addonTracks: '', name: '1502-SF27' },
  { teamName: 'Whack a mole', tracks: 'MR and VR', addonTracks: '', name: '1502-SF31' },
  { teamName: 'ZoomMR', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '1508-SF20' },
  { teamName: 'Lava Legends', tracks: 'MR and VR', addonTracks: '', name: '1511-SF09' },
  { teamName: 'Vision Pilot', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '1507-SF19' },
  { teamName: 'XAirFlow', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '1506-SF18' },
  { teamName: 'Memory Garden', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '231-SF10' },
  { teamName: 'Reality Merge', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '1200-SF24' },
  { teamName: 'Placeholder', tracks: 'Passthrough Camera API', addonTracks: 'Hand Tracking', name: '1600-SF23' },
  { teamName: 'SensorAI', tracks: 'MR and VR', addonTracks: 'Hand Tracking', name: '220-SF25' }
];

// Juror names
const jurors = [
  'Juror 1', 'Juror 2', 'Juror 3', 'Juror 4', 'Juror 5',
  'Juror 6', 'Juror 7', 'Juror 8', 'Juror 9', 'Juror 10',
  'Juror 11', 'Juror 12', 'Juror 13', 'Juror 14', 'Juror 15'
];

// Generate realistic score
function generateScore(baseScore, variation = 2) {
  const score = baseScore + (Math.random() * variation * 2 - variation);
  return Math.max(1, Math.min(5, Math.round(score * 10) / 10));
}

// Generate track-specific scores
function generateTrackScores(tracks, addonTracks) {
  const scores = {
    passthroughCameraAPI: 0,
    immersiveEntertainment: 0,
    handTracking: 0,
    mrAndVR: 0,
    projectUpgrade: 0
  };

  if (tracks === 'Passthrough Camera API') {
    scores.passthroughCameraAPI = generateScore(3.5, 1.5);
  } else {
    scores.passthroughCameraAPI = generateScore(2, 1);
  }

  if (tracks === 'Immersive Entertainment' || addonTracks === 'Immersive Entertainment') {
    scores.immersiveEntertainment = generateScore(3.5, 1.5);
  } else {
    scores.immersiveEntertainment = generateScore(2, 1);
  }

  if (addonTracks === 'Hand Tracking') {
    scores.handTracking = generateScore(3.5, 1.5);
  } else {
    scores.handTracking = generateScore(2, 1);
  }

  if (tracks === 'MR and VR') {
    scores.mrAndVR = generateScore(3.5, 1.5);
  } else {
    scores.mrAndVR = generateScore(2, 1);
  }

  if (tracks === 'Project Upgrade') {
    scores.projectUpgrade = generateScore(3.5, 1.5);
  } else {
    scores.projectUpgrade = generateScore(2, 1);
  }

  return scores;
}

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

// Create demo data for each juror
console.log('🎯 Creating demo score data files...\n');

jurors.forEach(juror => {
  const ratings = {};

  teams.forEach((team, index) => {
    const teamKey = `${team.name}_${team.teamName}`;

    // Base scores
    let concept = generateScore(3.2, 1.5);
    let quality = generateScore(3, 1.5);
    let implementation = generateScore(3.1, 1.5);

    // Track-specific scores
    const trackScores = generateTrackScores(team.tracks, team.addonTracks);

    // Boost scores for actual winners
    const teamName = team.teamName.toLowerCase();
    if (teamName.includes('edgelord')) {
      concept = generateScore(4.2, 0.5);
      quality = generateScore(4.4, 0.5);
      implementation = generateScore(4.1, 0.5);
      if (team.tracks === 'Project Upgrade') trackScores.projectUpgrade = generateScore(4.5, 0.3);
    } else if (teamName.includes('staxel')) {
      concept = generateScore(4, 0.5);
      quality = generateScore(3.9, 0.5);
      implementation = generateScore(4.1, 0.5);
      if (team.tracks === 'Project Upgrade') trackScores.projectUpgrade = generateScore(4.3, 0.3);
    } else if (teamName.includes('takeover')) {
      concept = generateScore(4.4, 0.5);
      quality = generateScore(4.3, 0.5);
      implementation = generateScore(4.4, 0.5);
      if (team.tracks === 'MR and VR') trackScores.mrAndVR = generateScore(4.5, 0.3);
      if (team.addonTracks === 'Hand Tracking') trackScores.handTracking = generateScore(4.5, 0.3);
    } else if (teamName.includes('pathfinder')) {
      concept = generateScore(4.1, 0.5);
      quality = generateScore(4, 0.5);
      implementation = generateScore(4.2, 0.5);
      if (team.tracks === 'MR and VR') trackScores.mrAndVR = generateScore(4.3, 0.3);
    } else if (teamName.includes('thatsmyjam')) {
      concept = generateScore(4.3, 0.5);
      quality = generateScore(4.2, 0.5);
      implementation = generateScore(4.4, 0.5);
      if (team.tracks === 'Passthrough Camera API') trackScores.passthroughCameraAPI = generateScore(4.5, 0.3);
    } else if (teamName.includes('jae-z')) {
      concept = generateScore(4.1, 0.5);
      quality = generateScore(4, 0.5);
      implementation = generateScore(4.1, 0.5);
      if (team.tracks === 'Passthrough Camera API') trackScores.passthroughCameraAPI = generateScore(4.3, 0.3);
    } else if (teamName.includes('hygge')) {
      concept = generateScore(4.2, 0.5);
      quality = generateScore(4.3, 0.5);
      implementation = generateScore(4.1, 0.5);
      if (team.addonTracks === 'Immersive Entertainment') trackScores.immersiveEntertainment = generateScore(4.5, 0.3);
    }

    // Calculate total
    const total = concept + quality + implementation +
                 trackScores.passthroughCameraAPI +
                 trackScores.immersiveEntertainment +
                 trackScores.handTracking +
                 trackScores.mrAndVR +
                 trackScores.projectUpgrade;

    ratings[teamKey] = {
      teamKey,
      judgeId: juror,
      teamName: team.teamName,
      teamNumber: team.name.split('-')[1] || '',
      projectName: `Demo Project ${index + 1}`,
      roomNumber: team.name,
      tracks: team.tracks,
      addonTracks: team.addonTracks,
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

  // Write to file
  const filename = `demo-scores-${juror.replace(' ', '-').toLowerCase()}.json`;
  fs.writeFileSync(filename, JSON.stringify({ judgeId: juror, ratings }, null, 2));
  console.log(`✅ Created ${filename} with ${Object.keys(ratings).length} team ratings`);
});

console.log(`\n🎉 Created demo score files for ${jurors.length} jurors`);
console.log(`📈 Each file contains ratings for ${teams.length} teams`);
console.log(`📊 Total demo ratings: ${teams.length * jurors.length}`);
console.log(`\n💡 Upload these files through the jury walk interface to populate demo scores.`);