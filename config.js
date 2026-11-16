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
  newsletterName: "Econ Explained",
  // Phrase utilisée par Google et lors du partage du lien (≈ 150 caractères max)
  description: "Econ Explained is a weekly newsletter designed to help you learn the fundamentals of economics and finance.",
  // S'affiche après « New issue every … » : écris juste le jour et l'heure
  publishingTime: "Sunday, 10:00 a.m.",

  // Adresse finale du site, SANS « / » à la fin.
  // Ex. GitHub Pages : "https://ton-pseudo.github.io/Newsletter"
  // Ex. nom de domaine : "https://www.econexplained.com"
  siteUrl: "https://exevrd-ship-it.github.io/Newsletter",

  /* ---------- Toi ---------- */
  author: {
    firstName: "Tom",
    lastName: "Lyaudet",
    initials: "TL",                 // 2 lettres, affichées dans le portrait
    age: 17,
    city: "Lyon",
    studying: "12th Grade",
    school: "Lycée Rosa Parks",     // "" pour ne pas l'afficher
    goal: "Develop an understanding of the economic and financial world",
    // Photo (facultatif) : mets ton image dans le dossier assets/ puis écris
    // son nom ici, ex. "assets/portrait.jpg". Laisse "" pour les initiales.
    photo: "",
  },

  // Page About : titre et texte de la partie « pourquoi cette newsletter »
  // (un paragraphe par ligne "…",)
  whyTitle: "Why we created this newsletter",
  whyIStarted: [
    "We believe that today, to truly understand the world we live in, we must first understand the basics of economics and finance. More generally, the economy is at the heart of media coverage, particularly in France and even in the U.S.",
    "Our weekly newsletter will provide a summary of the global economic landscape to keep you informed in the best and fastest way possible.",
  ],

  contactEmail: "econ.explained23@gmail.com",

  // Réseaux sociaux : colle le lien COMPLET (https://…), ou laisse "" pour masquer
  social: {
    linkedin: "",   // ex. "https://www.linkedin.com/in/ton-profil/"
    instagram: "https://www.instagram.com/econ_explained23/",
    x: "",          // ex. "https://x.com/ton_pseudo"
  },

  /* ---------- Tes expériences (page About) ----------
     Ajoute, supprime ou modifie des blocs { … }, séparés par des virgules. */
  experiencesIntro: "In June 2024, I did two internships in Lyon, which gave me a good insight into the professional world.",
  experiences: [
    {
      role: "Intern, real estate",
      organisation: "Aldéa Immobilier · Independent estate agency, Lyon",
      period: "June 10–16, 2024",
      description: "I learned how property sales and rentals are handled, and I saw how important it is to build trust with clients.",
    },
    {
      role: "Intern, banking",
      organisation: "Caisse d'Epargne Rhône Alpes · Headquarters, Tour Incity, Lyon",
      period: "June 17–23, 2024",
      description: "I got a better understanding of how a bank works, especially its financial, marketing and sales sides.",
    },
  ],
  experiencesConclusion: "Both internships increased my interest in finance and real estate. They also taught me to be punctual, adaptable and a good team player.",

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
