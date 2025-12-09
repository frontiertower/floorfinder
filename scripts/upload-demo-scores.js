const fs = require('fs');
const fetch = require('node-fetch');

async function uploadDemoScores() {
  const baseUrl = 'https://floorfinder-8bf5bw937-dablclub.vercel.app';

  console.log('🚀 Uploading demo scores to production...\n');

  // Get list of demo score files
  const files = fs.readdirSync('.')
    .filter(file => file.startsWith('demo-scores-juror-') && file.endsWith('.json'))
    .sort();

  console.log(`📁 Found ${files.length} demo score files\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const jurorName = data.judgeId;

      console.log(`📤 Uploading scores for ${jurorName}...`);

      const response = await fetch(`${baseUrl}/api/jury-ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log(`✅ ${jurorName}: ${result.count} teams scored successfully`);
        successCount++;
      } else {
        console.log(`❌ ${jurorName}: Failed - ${result.error || 'Unknown error'}`);
        errorCount++;
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log(`❌ ${file}: Error - ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Upload complete!`);
  console.log(`✅ Successful uploads: ${successCount}`);
  console.log(`❌ Failed uploads: ${errorCount}`);

  if (successCount > 0) {
    console.log(`\n🎯 Demo scores are now live! Visit the jury walk page to see winners and rankings.`);
    console.log(`🔗 ${baseUrl}/jury-walk`);
  }
}

uploadDemoScores().catch(console.error);