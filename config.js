/* ==========================================================================
   ✏️  TES INFORMATIONS — c'est le SEUL fichier à modifier pour personnaliser
   le site. Remplace le texte entre guillemets "…", enregistre, et c'est tout.

   Règles simples :
   - Garde les guillemets "…" autour du texte et la virgule en fin de ligne.
   - Si ton texte contient un guillemet ", écris \" à la place.
   - Laisse "" (vide) pour ce que tu ne veux pas afficher.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ---------- La newsletter ---------- */
  newsletterName: "The Sunday Ledger",
  // Phrase utilisée par Google et lors du partage du lien (≈ 150 caractères max)
  description: "A free weekly newsletter that explains the world economy clearly and neutrally: wars, crises, jobs, politics and markets, in six minutes.",
  publishingTime: "Sunday, 8:00 a.m.",

  // Adresse finale du site, SANS « / » à la fin.
  // Ex. GitHub Pages : "https://ton-pseudo.github.io/Newsletter"
  // Ex. nom de domaine : "https://www.thesundayledger.com"
  siteUrl: "https://exevrd-ship-it.github.io/Newsletter",

  /* ---------- Toi ---------- */
  author: {
    firstName: "[First name]",
    initials: "SL",                 // 2 lettres, affichées dans le portrait
    age: 17,
    city: "Lyon",
    studying: "Final year, lycée",  // ex. "Terminale, spécialité SES"
    goal: "A top business school",
    // Photo (facultatif) : mets ton image dans le dossier assets/ puis écris
    // son nom ici, ex. "assets/portrait.jpg". Laisse "" pour les initiales.
    photo: "",
  },

  contactEmail: "hello@yourdomain.com",

  // Réseaux sociaux : colle le lien complet, ou laisse "" pour masquer
  social: {
    linkedin: "",
    instagram: "",
    x: "",
  },

  /* ---------- Tes expériences (page About) ----------
     Ajoute, supprime ou modifie des blocs { … }, séparés par des virgules. */
  experiences: [
    {
      role: "Intern",
      organisation: "Independent wealth management firm · Lyon",
      period: "",                   // ex. "Summer 2025"
      description: "Observed how advisers build savings and investment strategies for families: risk profiles, diversification, life insurance and retirement planning. My first real lesson in how interest rates and markets affect ordinary households.",
    },
    {
      role: "Intern",
      organisation: "Caisse d'Épargne · Retail banking",
      period: "",
      description: "Shadowed advisers in a branch: savings accounts, consumer and mortgage loans, client meetings. A front-row view of how ECB decisions end up in the rates people are actually offered.",
    },
    {
      role: "Student job",
      organisation: "Part-time, alongside school",
      period: "",
      description: "Working with customers taught me reliability, time management, and what a price increase looks like from the other side of the counter.",
    },
  ],

  /* ---------- Inscriptions ----------
     mode "demo"     : le formulaire affiche juste un message (aucun email enregistré).
     mode "form"     : envoie l'email à ton outil (Buttondown, Mailchimp, Formspree…).
     mode "redirect" : ouvre la page d'inscription de ton outil (Substack, Beehiiv…).
     Voir GUIDE.md, étape 3, pour savoir quoi mettre selon ton outil. */
  subscribe: {
    mode: "demo",
    url: "",
    emailField: "email",
  },
};
