# Guide : personnaliser et mettre le site en ligne

Pas besoin de logiciel : tout se fait depuis le site de GitHub, dans ton navigateur.
Pour modifier un fichier sur GitHub : ouvre-le → icône **crayon ✏️** (« Edit this file ») → modifie → bouton vert **Commit changes**.
Chaque modification enregistrée met le site à jour tout seul en 1 à 2 minutes.

---

## Étape 1 : renseigner tes informations (fichier `config.js`)

Ouvre **`config.js`**, à la racine du dépôt. C'est le **seul fichier** à modifier pour tes infos :

| Champ | À quoi ça sert |
|---|---|
| `newsletterName` | Nom de la newsletter, partout sur le site, dans l'onglet du navigateur et sur Google |
| `description` | Phrase affichée par Google et quand on partage le lien |
| `publishingTime` | « Sunday, 8:00 a.m. » ou autre |
| `siteUrl` | Adresse finale du site (voir étape 2), **sans `/` à la fin** |
| `author.firstName`, `lastName`, `initials`, `age`, `city`, `studying`, `school`, `goal` | Toi (page About, signature des articles, pied de page) |
| `whyIStarted` | Le texte « Why I started this newsletter » de la page About (un paragraphe par ligne) |
| `author.photo` | Ta photo (facultatif) : dépose-la dans `assets/` (bouton *Add file → Upload files*), puis écris `"assets/nom-de-ta-photo.jpg"` |
| `contactEmail` | Adresse de contact affichée sur le site |
| `social` | Liens LinkedIn / Instagram / X (vide = masqué) |
| `experiences` | Tes stages et jobs (page About). Ajoute ou supprime des blocs `{ … },` |
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

## Étape 4 : publier un nouveau numéro chaque semaine

1. **Créer l'article** : ouvre `article-what-is-inflation.html` → icône **⋯** → copie tout le contenu → *Add file → Create new file*, nomme-le par exemple `issue-25-oil-prices.html`, colle, puis remplace le titre, la date, la catégorie et le texte (entre les balises `<p>…</p>`).
2. **L'ajouter aux archives** : dans `articles.html`, copie un bloc `<li class="issue-row" …> … </li>` et colle-le **tout en haut** de la liste. Change le numéro, le titre, le lien (`href="issue-25-oil-prices.html"`), la date et la catégorie (`data-category="recap"`, `"econ"` ou `"finance"`).
3. **La page d'accueil** : dans `index.html`, mets à jour les 3 cartes « Latest issues ».

> Les numéros #17 à #24 sont des **exemples** : remplace-les ou supprime-les avant de faire connaître le site.

### Changer le Chart of the Week
- **Les données** : dans `js/main.js`, cherche `CHARTS`. Tu y trouves les années (`x`), les valeurs de chaque courbe (`values`), leur nom (`label`) et les bornes de l'axe (`yMin`, `yMax`).
- **Les textes** : titre, explications et source se modifient dans `chart-of-the-week.html` (et dans le bloc « Chart of the Week » de `index.html`).

---

## Ce que contient le dépôt
- `config.js` : **tes informations** (étape 1)
- `index.html`, `articles.html`, `chart-of-the-week.html`, `about.html`, `article-*.html`, `404.html` : les pages
- `css/style.css` : couleurs et mise en page (couleurs en haut du fichier, dans `:root`)
- `js/main.js` : fonctionnement (mode sombre, menu, formulaires, graphique)
- `assets/` : logo, image de partage, ta photo
- `.github/workflows/deploy.yml` et `tools/` : mise en ligne automatique (ne pas toucher)
