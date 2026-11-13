# The Sunday Ledger — newsletter website

Static website (HTML/CSS/JS, no build step) for a weekly economics & finance newsletter.

## Pages
| File | Content |
|---|---|
| `index.html` | Home: hero + subscribe form, latest 3 issues, Chart of the Week preview, sections, author quote |
| `articles.html` | Issue archive with filters (Weekly Recap / Econ 101 / Monthly Finance), date, reading time |
| `chart-of-the-week.html` | Featured interactive chart + explanation + past charts |
| `about.html` | Author bio, experience, editorial principles, contact |
| `article-what-is-inflation.html` | Full sample article (template for future issues) |

Every page has a subscribe form at the top (hero or slim bar) and at the bottom.
Dark mode: toggle in the header (remembers the choice, follows the system by default).

## Personnaliser (à faire en premier)
Ouvre `js/main.js` et modifie l'objet `SITE` en haut du fichier :
- `name` : nom de la newsletter (provisoire : « The Sunday Ledger »)
- `author`, `initials` : ton prénom et tes initiales
- `email` : adresse de contact
- `formAction` : l'URL d'inscription de ton outil (Buttondown, Beehiiv, Substack, Mailchimp, Formspree…). Vide = mode démo.

Le nom/prénom est injecté partout automatiquement. Pense aussi à remplacer
« The Sunday Ledger » dans les balises `<title>` / `<meta>` pour le référencement.

## Ajouter un numéro
1. Duplique `article-what-is-inflation.html` et remplace le contenu.
2. Ajoute une ligne `<li class="issue-row" data-category="recap|econ|finance">` en haut de `articles.html`.
3. Mets à jour les 3 cartes « Latest issues » de `index.html`.

Les numéros #17 à #24 (sauf #22) sont des exemples de titres : remplace-les par tes vrais articles.

## Chart of the Week
Les données sont dans `CHARTS` dans `js/main.js` (années, séries, bornes de l'axe). Données actuelles :
inflation HICP zone euro (Eurostat) et taux de dépôt BCE (fin d'année), 2015–2024.

## Mise en ligne
Hébergement gratuit possible sur GitHub Pages, Netlify ou Vercel : il suffit de publier le dossier tel quel.
