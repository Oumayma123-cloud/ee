const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '26-16-03-4-Tiqqa.postman_collection.json');
const outputPath = path.join(__dirname, 'postman_hierarchy.txt');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const collection = JSON.parse(fileContent);
  let output = '';

  function printItem(item, indent = '') {
    if (item.item) {
      output += `${indent}📁 [Folder] ${item.name}\n`;
      item.item.forEach(subItem => printItem(subItem, indent + '  '));
    } else {
      const method = item.request && item.request.method ? item.request.method : 'GET';
      let urlStr = '';
      if (item.request && item.request.url) {
        if (typeof item.request.url === 'string') {
          urlStr = item.request.url;
        } else if (item.request.url.raw) {
          urlStr = item.request.url.raw;
        }
      }
      output += `${indent}🚀 [Request] ${item.name} (${method} - ${urlStr})\n`;
    }
  }

  if (collection.item && Array.isArray(collection.item)) {
    collection.item.forEach(item => printItem(item));
  } else {
    output = 'No items found in collection.';
  }

  fs.writeFileSync(outputPath, output, 'utf8');
  console.log('Successfully written hierarchy to postman_hierarchy.txt');
} catch (err) {
  console.error('Error:', err);
}
