# Guide : personnaliser et mettre le site en ligne

Pas besoin de logiciel : tout se fait depuis le site de GitHub, dans ton navigateur.
Pour modifier un fichier sur GitHub : ouvre-le → icône **crayon ✏️** (« Edit this file ») → modifie → bouton vert **Commit changes**.
Chaque modification enregistrée met le site à jour tout seul en 1 à 2 minutes.

---

## Étape 1 : renseigner tes informations (fichier `config.js`)

Ouvre **`config.js`**, à la racine du dépôt. C'est le **seul fichier** à modifier pour tes infos :

| Champ | À quoi ça sert |
|---|---|
| `Econ Explained` | Nom de la newsletter, partout sur le site, dans l'onglet du navigateur et sur Google |
| `“Econ Explained” is a website designed to help you learn the fundamentals of economics and finance.` | Phrase affichée par Google et quand on partage le lien |
| `Every sunday at 10 a.m.` | « Sunday, 8:00 a.m. » ou autre |
| `siteUrl` | Adresse finale du site (voir étape 2), **sans `/` à la fin** |
| `Tom`, `Lyaudet`, `TL`, `17`, `Lyon`, `12th Grade`, `Rosa Parks`, `Develop an understanding of the economic and financial world ` | Toi (page About, signature des articles, pied de page) |
| `Why did we creat this newsletter ? We believe that today, to truly understand the world we live in, we must first understand the basics of economics and finance. More generally, the economy is at the heart of media coverage, particularly in France and even in the U.S. Our weekly newsletter will provide a summary of the global economic landscape to keep you informed in the best and fastest way possible. ` | Le texte « Why I started this newsletter » de la page About (un paragraphe par ligne) |
| `author.photo` | Ta photo (facultatif) : dépose-la dans `assets/` (bouton *Add file → Upload files*), puis écris `"assets/nom-de-ta-photo.jpg"` |
| `econ.explained23@gmail.com` | Adresse de contact affichée sur le site |
| `Liens LinkedIn : Tom Lyaudet / Instagram : econ_explained23 / X : Econ.explained_` | Liens LinkedIn / Instagram  / X |
|In June 2024, I did two internships in Lyon, which gave me a good insight into the professional world.

From June 10 to 16, I worked at Aldéa Immobilier, an independent estate agency at 143 Rue Cuvier (69006). I learned how property sales and rentals are handled, and I saw how important it is to build trust with clients.

The following week, from June 17 to 23, I joined Caisse d'Epargne Rhône Alpes at its headquarters in the Tour Incity (116 Cours Lafayette, 69003). I got a better understanding of how a bank works, especially its financial, marketing and sales sides.

Both internships increased my interest in finance and real estate. They also taught me to be punctual, adaptable and a good team player.

---` | Tes stages et jobs (page About). Ajoute ou supprime des blocs `{ … },` |
| `subscribe` | Branchement du formulaire d'inscription (étape 3) |

⚠️ Garde bien les guillemets `"…"` et les virgules en fin de ligne. Si le site affiche
une page cassée après une modification, c'est presque toujours une virgule ou un guillemet oublié.

---

## Étape 2 : mettre le site en ligne (GitHub Pages, gratuit)

À faire **une seule fois** :

1. Sur la page du dépôt GitHub, va dans **Settings** → **Pages** (menu de gauche).
2. Dans **Build and deployment → Source**, choisis **GitHub Actions**.
3. Va dans l'onglet **Actions** → clique sur **Publish website** (à gauche) → bouton **Run workflow** → **Run workflow**.
4. Attends la coche verte ✅ (1 à 2 minutes). Ton site est en ligne à l'adresse :
   **https://exevrd-ship-it.github.io/Newsletter/**

Ensuite, chaque modification enregistrée sur la branche principale republie le site automatiquement.

### Option : ton propre nom de domaine (ex. `www.thesundayledger.com`)
1. Achète le domaine (OVH, Gandi, Namecheap… environ 10 €/an).
2. Settings → Pages → **Custom domain** : tape ton domaine, puis suis les instructions DNS de GitHub.
3. Mets à jour `siteUrl` dans `config.js` avec la nouvelle adresse.

---

## Étape 3 : recevoir de vrais abonnés

Par défaut, le formulaire est en mode `"demo"` : il affiche un message mais **n'enregistre rien**.
Crée un compte gratuit sur un outil de newsletter (c'est aussi lui qui enverra tes emails le dimanche), puis remplis le bloc `subscribe` de `config.js` :

**Substack** (le plus simple pour démarrer)
```js
subscribe: { mode: "redirect", url: "https://TON-PSEUDO.substack.com/subscribe?email={email}", emailField: "email" },
```

**Buttondown**
```js
subscribe: { mode: "form", url: "https://buttondown.com/api/emails/embed-subscribe/TON-PSEUDO", emailField: "email" },
```

**Mailchimp** : Audience → Signup forms → Embedded forms → copie l'adresse qui suit `action="` dans le code proposé.
```js
subscribe: { mode: "form", url: "https://….list-manage.com/subscribe/post?u=…&id=…", emailField: "EMAIL" },
```

**Beehiiv** ou autre outil : utilise `mode: "redirect"` avec l'adresse de ta page d'inscription.

Teste ensuite en t'inscrivant toi-même avec ton adresse.

---

## Étape 4 : publier ton numéro chaque dimanche

Tu écris ton texte dans un **simple fichier texte** (format Markdown), sans aucun code.
Le site crée tout seul la page de l'article, l'ajoute aux archives et met à jour l'accueil.

1. Ouvre le dossier **`issues/`** sur GitHub, puis le fichier **`_MODELE.md`** → copie tout son contenu.
2. Dans `issues/`, clique sur **Add file → Create new file**.
   Nomme le fichier avec la date et quelques mots : `2026-11-15-oil-prices.md`.
3. Colle le modèle, puis remplis le haut du fichier :
   ```
   ---
   title: Why oil prices jumped this week
   date: 2026-11-15
   category: Weekly Recap
   summary: Une ou deux phrases de résumé.
   ---
   ```
   `category` vaut **Weekly Recap**, **Econ 101** ou **Monthly Finance**.
4. En dessous, écris ou colle ton texte (laisse une ligne vide entre les paragraphes).
5. Clique sur **Commit changes**. Le numéro est en ligne 1 à 2 minutes plus tard.

**Programmer à l'avance** : si tu mets une date future (le dimanche suivant), l'article reste
caché et se publie tout seul ce dimanche-là vers 8 h (9 h en heure d'été).
Tu peux donc l'écrire le samedi soir.

**Mise en forme dans le texte**

| Tu écris | Résultat |
|---|---|
| `## Mon intertitre` | Un intertitre |
| `**important**` | **gras** |
| `*mot*` | *italique* |
| `- élément` | Liste à puces |
| `> Une phrase forte` | Citation mise en avant |
| `[texte](https://lien.com)` | Lien |
| `![légende](assets/mon-image.png)` | Image (dépose-la d'abord dans `assets/`) |
| `:::box The short version` … `:::` | Encadré doré (tout ce qui est entre les deux lignes `:::`) |

Le numéro (#1, #2…) et le temps de lecture sont calculés automatiquement.
La page **Articles** range automatiquement tous tes numéros par **année puis par mois**, avec un sommaire
« Browse by month », une recherche et des filtres par rubrique. Rien à faire de ton côté.
Pour **corriger** un article : modifie son fichier `.md`. Pour le **retirer** : supprime-le.
Les fichiers qui commencent par `_` ne sont jamais publiés (pratique pour un brouillon : `_brouillon.md`).

> L'article sur l'inflation (`issues/2026-10-25-what-is-inflation.md`) est un exemple :
> garde-le, modifie-le ou supprime-le.

**Envoyer le numéro par email** : le site ne l'envoie pas tout seul. Colle le même texte dans ton outil
de newsletter (Substack, Buttondown…) et programme l'envoi pour dimanche 8 h.

### Changer le Chart of the Week
- **Les données** : dans `js/main.js`, cherche `CHARTS`. Tu y trouves les années (`x`), les valeurs de chaque courbe (`values`), leur nom (`label`) et les bornes de l'axe (`yMin`, `yMax`).
- **Les textes** : titre, explications et source se modifient dans `chart-of-the-week.html` (et dans le bloc « Chart of the Week » de `index.html`).

---

## Ce que contient le dépôt
- `config.js` : **tes informations** (étape 1)
- `issues/` : **tes numéros** (un fichier `.md` par dimanche)
- `index.html`, `articles.html`, `chart-of-the-week.html`, `about.html`, `404.html` : les pages (les pages `issue-*.html` sont créées automatiquement)
- `css/style.css` : couleurs et mise en page (couleurs en haut du fichier, dans `:root`)
- `js/main.js` : fonctionnement (mode sombre, menu, formulaires, graphique)
- `assets/` : logo, image de partage, ta photo
- `.github/workflows/deploy.yml`, `tools/` et `templates/` : mise en ligne automatique (ne pas toucher)
