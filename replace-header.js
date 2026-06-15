const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(pagesDir, function(filePath) {
  if (filePath.endsWith('.wxml') && !filePath.includes('medecin-garde-appel')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer header-section ou header par le composant
    let regex = /<view class="header(-section)?"[\s\S]*?<\/view>\s*<\/view>\s*<\/view>/g;
    
    // Il faut être prudent car le nombre de </view> de fermeture dépend de la structure. 
    // Au lieu de ça, on va chercher de <view class="header... jusqu'au commentaire d'après (<!-- 2. ...) ou similaire.
  }
});
