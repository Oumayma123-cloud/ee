const fs = require('fs');
const path = require('path');

const pages = [
  "pages/services/services",
  "pages/aide-menagere/aide-menagere",
  "pages/aide-menagere-calendar/aide-menagere-calendar",
  "pages/demarches-admin/demarches-admin",
  "pages/passport-steps/passport-steps",
  "pages/paiement-factures/paiement-factures",
  "pages/eau-electricite/eau-electricite",
  "pages/telephone-internet/telephone-internet",
  "pages/transport/transport",
  "pages/medecin-garde/medecin-garde",
  "pages/medecin-garde-attente/medecin-garde-attente",
  "pages/medecin-garde-appel/medecin-garde-appel"
];

pages.forEach(pagePath => {
  const absPathBase = path.join(__dirname, pagePath);
  
  // Fix WXSS
  const wxssPath = absPathBase + '.wxss';
  if (fs.existsSync(wxssPath)) {
    let content = fs.readFileSync(wxssPath, 'utf8');
    // Replace .bottom-spacer { ... }
    content = content.replace(/\.bottom-spacer\s*\{[\s\S]*?\}/g, '.bottom-spacer {\n  height: 0;\n}');
    fs.writeFileSync(wxssPath, content);
  }

  // Fix WXML
  const wxmlPath = absPathBase + '.wxml';
  if (fs.existsSync(wxmlPath)) {
    let content = fs.readFileSync(wxmlPath, 'utf8');
    // Add variant="fixed" if missing
    if (content.includes('<bottom-nav-bar') && !content.includes('variant="fixed"')) {
      content = content.replace(/<bottom-nav-bar/g, '<bottom-nav-bar variant="fixed"');
      fs.writeFileSync(wxmlPath, content);
    }
  }
});
console.log('Fixed all pages spaces!');
