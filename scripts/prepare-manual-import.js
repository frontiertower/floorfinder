const fs = require('fs');
const path = require('path');

console.log('📁 Preparing demo score files for manual import...\n');

// Copy files to a manual-import directory
const outputDir = 'manual-import';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Get all demo score files
const files = fs.readdirSync('.')
  .filter(file => file.startsWith('demo-scores-juror-') && file.endsWith('.json'))
  .sort();

console.log(`Found ${files.length} demo score files to prepare:\n`);

files.forEach((file, index) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const jurorName = data.judgeId;

  // Copy file to manual-import directory
  const outputFile = path.join(outputDir, file);
  fs.copyFileSync(file, outputFile);

  console.log(`${index + 1}. ${jurorName}: ${outputFile}`);
});

console.log(`\n✅ All files ready in ./${outputDir}/ directory`);
console.log(`\n📋 Manual Import Instructions:`);
console.log(`1. Visit your production app: https://floorfinder-8bf5bw937-dablclub.vercel.app/jury-walk`);
console.log(`2. For each juror (Juror 1 through Juror 15):`);
console.log(`   a. Select the juror from the dropdown`);
console.log(`   b. Use the import functionality in the interface`);
console.log(`   c. Upload the corresponding JSON file from ./${outputDir}/`);
console.log(`3. Repeat for all 15 jurors to populate the complete demo dataset`);
console.log(`\n🎯 This will populate 450 total ratings (30 teams × 15 jurors) with realistic competition data!`);