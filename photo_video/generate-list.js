const fs = require('fs');
const path = require('path');

const photoDir = path.join(__dirname, 'public/photos');
const outputFile = path.join(__dirname, 'src/photoList.ts');

try {
  // Read files and filter for common image extensions
  const files = fs.readdirSync(photoDir)
    .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));

  // Generate the TS file content
  const content = `// Auto-generated file - Do not edit manually\nexport const myPhotos = ${JSON.stringify(files, null, 2)};`;

  fs.writeFileSync(outputFile, content);
  console.log(`✅ Success: Found ${files.length} images in /public/photos`);
} catch (error) {
  console.error('❌ Error reading photos directory:', error.message);
}