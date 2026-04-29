# Site BIMaghreb — Mode d'emploi

Site one-page statique pour promouvoir vos services freelance d'études structures et BIM.

## Structure

```
website/
├── index.html              ← contenu du site (textes, services, projets)
├── style.css               ← apparence (couleurs, mise en page)
├── script.js               ← interactions (menu mobile, formulaire)
├── assets/
│   ├── logo-horizontal.svg ← logo nav + footer
│   ├── logo-icon.svg       ← favicon
│   ├── logo-icon-white.svg ← logo hero (fond sombre)
│   └── logo-square.svg     ← logo réseaux sociaux
└── LISEZ-MOI.md            ← ce fichier
```

## Tester le site en local

Double-cliquez simplement sur `index.html` — il s'ouvre dans votre navigateur.
Aucune installation, aucun serveur requis.

## Modifier le contenu (sans coder)

Tout le texte est dans `index.html`. Ouvrez-le avec Notepad++ ou VS Code,
et modifiez ce qui est entre les balises (par exemple `<h1>...</h1>`).

### À personnaliser dans le temps

1. **Email & LinkedIn** — déjà configurés :
   - Email : `bimaghreb@outlook.com`
   - LinkedIn : `https://www.linkedin.com/company/bimaghrebengineering/`

2. **Formulaire de contact** — branché sur Web3Forms (envoi réel direct
   vers `bimaghreb@outlook.com`, sans dépendance au client mail du visiteur).
   - Clé d'accès Web3Forms dans `index.html` (champ caché `access_key`).
   - Pour changer d'email destinataire : se reconnecter sur web3forms.com
     et modifier l'email associé à la clé (pas besoin de modifier le code).

3. **Projets exemples** — la section "Projets" contient 4 typologies
   anonymisées pour démarrer. À enrichir avec vos vrais projets dès
   que vous en avez à montrer (textes uniquement, pas de photos
   nécessaires).

## Mettre le site en ligne (gratuit)

Trois options gratuites, par ordre de simplicité :

### Option 1 — Netlify (le plus simple)
1. Allez sur https://app.netlify.com/drop
2. Glissez-déposez le dossier `website/` complet
3. Le site est en ligne en 30 secondes avec une URL `xxx.netlify.app`
4. Vous pouvez ensuite brancher un domaine personnalisé (ex. `bimaghreb.ma`)

### Option 2 — Cloudflare Pages
1. Créez un compte sur https://pages.cloudflare.com
2. Connectez un dépôt GitHub ou téléversez le dossier
3. URL `xxx.pages.dev` instantanée

### Option 3 — GitHub Pages
1. Créez un dépôt public `bimaghreb.github.io` sur GitHub
2. Téléversez le contenu de `website/` à la racine
3. Activez Pages dans Settings → Pages
4. URL `bimaghreb.github.io` disponible sous 2 minutes

## Acheter un domaine personnalisé (optionnel)

Pour avoir `bimaghreb.ma` ou `bimaghreb.com` :
- `.ma` chez l'ANRT (~150 MAD/an) via un registrar agréé
- `.com` chez Cloudflare ou Namecheap (~10 USD/an, ~100 MAD)

Le domaine se branche ensuite sur Netlify / Cloudflare Pages en 5 minutes.

## Évolutions possibles plus tard

- Ajouter une page Blog (articles techniques pour le SEO)
- Ajouter une galerie photo des projets réalisés
- Versions arabe et anglaise
- Formulaire de contact qui envoie un vrai email (via Formspree ou
  Cloudflare Forms — gratuit jusqu'à un certain volume)
