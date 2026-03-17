# PAPS — Email Signature Generator

## Contexte projet
Outil interne PAPS permettant aux collaborateurs de générer 
leur signature email au format Gmail (Google Workspace).

## Ce que l'outil doit faire
- Formulaire avec les champs : nom complet, poste, téléphone, 
  email, lien personnalisé + intitulé
- Prévisualisation live de la signature
- Bouton "Copier le HTML" pour coller dans Gmail
- Instructions d'installation Gmail intégrées

## Identité visuelle PAPS
- Couleurs : Navy #272F59 | Steel #399EBF | Yellow #FFC60A | Orange #F4991A
- Police : Montserrat
- Logo : https://ci3.googleusercontent.com/mail-sig/AIorK4wgvGg5d5rVCXusXC2gfB485CKHWHMSvhIrZ_RvOvUtp96wynKcyjsT7BrD5DnAeHmaE3TGrDvbV1NP
- Site : https://papslogistics.com

## Format de signature cible
Formule d'intro (ex: "Your friend,")
Nom en gras
Poste
Téléphone cliquable
Email cliquable
Lien personnalisé cliquable
Logo PAPS cliquable
www.papslogistics.com
Icônes réseaux sociaux : LinkedIn, X, Facebook, Instagram, TikTok, YouTube

## Réseaux sociaux (URLs fixes)
- LinkedIn : https://www.linkedin.com/company/paps
- X : https://x.com/papslogistics
- Facebook : https://www.facebook.com/Papsapp/
- Instagram : https://www.instagram.com/paps_sn
- TikTok : https://www.tiktok.com/@papslogistics
- YouTube : https://www.youtube.com/@papsapp

## Stack technique
- Framework : Next.js (App Router)
- Styling : Tailwind CSS
- Pas de base de données — stateless, pas d'auth
- Déploiement : Vercel

## Contraintes
- Outil utilisé via Google Workspace — Gmail uniquement
- Le HTML généré doit être collable dans l'éditeur source Gmail
- Mobile responsive pour le formulaire