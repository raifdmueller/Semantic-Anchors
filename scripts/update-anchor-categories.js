const fs = require('fs');
const path = require('path');

// Load the MECE categories mapping
const categoriesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'website', 'public', 'data', 'categories.json'), 'utf-8')
);

// Create reverse mapping: anchorId -> categoryId
const anchorToCategoryMap = new Map();
categoriesData.forEach(category => {
  category.anchors.forEach(anchorId => {
    anchorToCategoryMap.set(anchorId, category.id);
  });
});

// Directory containing anchor files
const ANCHORS_DIR = path.join(__dirname, '..', 'docs', 'anchors');

// Get all .adoc files
const anchorFiles = fs.readdirSync(ANCHORS_DIR).filter(f => f.endsWith('.adoc'));

console.log(`🔄 Updating categories in ${anchorFiles.length} anchor files...`);

let updatedCount = 0;

anchorFiles.forEach(file => {
  const anchorId = file.replace('.adoc', '');
  const filePath = path.join(ANCHORS_DIR, file);

  // Get the correct category for this anchor
  const correctCategory = anchorToCategoryMap.get(anchorId);

  if (!correctCategory) {
    console.log(`   ⚠️  ${anchorId}: No category mapping found, skipping`);
    return;
  }

  // Read file content
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if file has :categories: attribute
  const categoriesRegex = /:categories:\s*([^\n]+)/;
  const match = content.match(categoriesRegex);

  if (match) {
    const currentCategory = match[1].trim();

    if (currentCategory !== correctCategory) {
      // Replace the category
      content = content.replace(categoriesRegex, `:categories: ${correctCategory}`);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✓ ${anchorId}: ${currentCategory} → ${correctCategory}`);
      updatedCount++;
    }
  } else {
    // Add :categories: attribute after title
    const titleRegex = /(= .+\n)/;
    content = content.replace(titleRegex, `$1:categories: ${correctCategory}\n`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`   ✓ ${anchorId}: Added category ${correctCategory}`);
    updatedCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} files`);
console.log(`\n💡 Run 'node extract-metadata.js' to regenerate categories.json`);
