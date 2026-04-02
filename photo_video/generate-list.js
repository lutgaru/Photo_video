const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../resources/video2');
const publicDir = path.join(__dirname, './public');
const outputFile = path.join(__dirname, './src/photoList.ts');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        removeDirRecursive(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    }
    fs.rmdirSync(dir);
  }
}


function listImagesRecursive(dir) {
  const images = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      images.push(...listImagesRecursive(fullPath));
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
      images.push(path.relative(publicDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return images;
}

try {
  copyDirRecursive(sourceDir, publicDir);

  const files = listImagesRecursive(publicDir);

  const content = `// Auto-generated file - Do not edit manually\nexport const myPhotos = ${JSON.stringify(files, null, 2)};`;

  fs.writeFileSync(outputFile, content);
  console.log(`✅ Success: Found ${files.length} images in public/photos`);
} catch (error) {
  console.error('❌ Error reading photos directory:', error.message);
}
