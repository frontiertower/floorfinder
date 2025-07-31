const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '995Plans.html');

fs.readFile(inputPath, 'utf-8', (err, htmlContent) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const imgTags = htmlContent.match(/<img[^>]+src=["'][^>]+>/g);

  if (imgTags) {
    imgTags.forEach((imgTag, index) => {
      const srcMatch = imgTag.match(/src=["'](data:image/svg+xml,%3Csvg[^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        let svgContent = srcMatch[1].replace('data:image/svg+xml,', '');

        // Decode URL-encoded characters
        svgContent = decodeURIComponent(svgContent);

        // Basic formatting (indentation might require a proper SVG parser for perfect results)
        // This is a simple approach assuming a basic structure
        svgContent = svgContent.replace(/></g, '>
<');

        const outputPath = path.join(__dirname, `svg-${index}.svg`);
        fs.writeFile(outputPath, svgContent, 'utf-8', (writeErr) => {
          if (writeErr) {
            console.error(`Error writing SVG file ${index}:`, writeErr);
          } else {
            console.log(`Saved SVG ${index} to ${outputPath}`);
          }
        });
      }
    });
  } else {
    console.log('No img tags found with matching src pattern.');
  }
});
