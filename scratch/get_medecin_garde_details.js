const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '26-16-03-4-Tiqqa.postman_collection.json');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const collection = JSON.parse(fileContent);

  function printDetails(item) {
    if (item.name === 'Créer une demande' || item.name === 'create') {
      console.log('---', item.name, '---');
      console.log('URL:', item.request.url.raw || item.request.url);
      console.log('Method:', item.request.method);
      if (item.request.body && item.request.body.raw) {
        console.log('Body:', item.request.body.raw);
      }
    }
    if (item.item) {
      item.item.forEach(printDetails);
    }
  }

  if (collection.item && Array.isArray(collection.item)) {
    collection.item.forEach(printDetails);
  }
} catch (err) {
  console.error('Error:', err);
}
