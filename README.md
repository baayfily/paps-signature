# PAPS — Générateur de Signatures Email

> Le chef-d'œuvre technico-marketing de **Baye Fily** — conçu pour réconcilier les puristes du code et les esthètes de la communication.

Aux développeurs qui pensaient que le marketing n'était fait que de feutres de couleur, et aux rédacteurs qui croient encore qu'un *hash* n'est qu'un hashtag sur Instagram : voici la preuve ultime que la tech et le marketing peuvent fusionner dans une harmonie parfaite.

Ce projet est un générateur de signatures e-mail apatride écrit en Next.js, spécialement conçu pour les équipes de **PAPS** à travers le monde (Sénégal, Côte d'Ivoire, Cap-Vert, et au-delà).

---

## 🚀 Fonctionnalités & Philosophie

### 🎨 L'Alliance de la Tech et du Marketing

*   **Validation intelligente au clic et à la perte de focus (`onBlur`)** : Parce qu'on ne veut pas agresser vos yeux avec des messages d'erreur rouges dès le chargement de la page, mais qu'on refuse de vous laisser copier une signature mal configurée.
*   **Cryptographie SHA-256 (Zéro fuite)** : Le mot de passe de l'administration n'est pas stocké en clair dans ce code (évitant ainsi les sueurs froides lors du commit public sur GitHub). Seul son hash SHA-256 est enregistré, validé en local à la volée via la Web Crypto API standard du navigateur.
*   **Formatage téléphonique sur mesure** : L'indicatif national (ex: `+221` pour le Sénégal) est verrouillé dans un badge fixe. La saisie du numéro est automatiquement formatée en temps réel selon les règles du pays sélectionné (ex: `77 123 45 67` pour le Sénégal).
*   **Campagnes rétroactives et dynamiques** : Les signatures générées n'intègrent pas de liens ou de bannières figés. Elles appellent nos routes API dédiées (`/api/campaign-image` et `/api/campaign-link`). Modifiez la campagne dans le panneau d'administration, et la bannière change instantanément pour tous vos collaborateurs, même ceux qui ont installé leur signature il y a six mois.
*   **Favicon officiel local** : Notre `favicon.jpg` personnalisé, extrait directement de notre identité visuelle, remplace l'icône Next.js par défaut. Parce qu'un projet sans favicon, c'est comme une campagne marketing sans UTM : un triste oubli.

---

## 🛠️ Démarrage Local

Installez d'abord les dépendances :
```bash
npm install
```

Lancez le serveur de développement :
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour commencer à générer ou configurer.

---

## 📂 Base de Données CSV

Les configurations par pays (réseaux sociaux actifs, liens de réseaux spécifiques par pays, redirections d'UTMs, bannières actives) sont enregistrées directement côté serveur dans le fichier CSV [countries.csv](public/countries.csv). L'interface d'administration gère l'import, l'export et la sauvegarde automatique sur ce fichier en un seul clic, avec effet de confetti intégré.

*Que vos clics soient traqués, vos numéros standardisés, et votre console vide.*
