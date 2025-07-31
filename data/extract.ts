import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

const inputPath = path.join(__dirname, '995Plans.html');
const htmlContent = readFileSync(inputPath, 'utf-8');

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
      writeFileSync(outputPath, svgContent, 'utf-8');
      console.log(`Saved SVG ${index} to ${outputPath}`);
    }
  });
} else {
  console.log('No img tags found with matching src pattern.');
}
