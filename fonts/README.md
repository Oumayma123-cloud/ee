Télécharger et installer les polices Poppins pour l'app

Pour que l'application affiche exactement la police utilisée dans Figma (Poppins), ajoutez les fichiers de police dans le dossier `/fonts` du projet.

Fichiers recommandés (placer dans `/fonts`):
- Poppins-Regular.ttf    (font-weight: 400)
- Poppins-SemiBold.ttf   (font-weight: 600)

Où télécharger :
- Google Fonts (sélectionnez Poppins, puis Download family):
  https://fonts.google.com/specimen/Poppins

Après avoir placé les fichiers, relancez l'application dans le simulateur. Les règles `@font-face` dans `app.wxss` chargent automatiquement ces fichiers.

Remarques :
- Si vous avez besoin d'autres graisses (300, 700...), ajoutez les fichiers correspondants et déclarez d'autres `@font-face`.
- Sur certains émulateurs, vous devez redémarrer l'app pour que les nouvelles polices soient prises en compte.
