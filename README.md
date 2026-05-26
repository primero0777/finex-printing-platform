# CAHIER DES CHARGES — Site Web FINEX PRO
**Version 1.0 — Mai 2026**

---

## 1. PRÉSENTATION DU PROJET

| | |
|---|---|
| **Client** | FINEX PRO |
| **Activité** | Imprimerie, Sérigraphie, Design Graphique & Objets Personnalisés |
| **Adresse** | Lomé – Adidogomé, Togo |
| **Contact** | +228 90 43 69 29 |
| **Prestataire** | Développement Web indépendant |
| **Type de projet** | Création de site web vitrine multi-pages |
| **Date de livraison** | Mai 2026 |

---

## 2. OBJECTIFS DU SITE

- Présenter l'activité et les services de FINEX PRO en ligne
- Renforcer la crédibilité et l'image de marque professionnelle
- Générer des contacts et des demandes de devis via WhatsApp
- Mettre en valeur les réalisations avec un portfolio photographique
- Être accessible en français et en anglais (bilingue FR/EN)

---

## 3. PAGES LIVRÉES

| Page | Description |
|---|---|
| **Accueil** (`index.html`) | Hero animé, services, portfolio aperçu, partenaires, CTA |
| **Services** (`services.html`) | Détail des 4 domaines : sérigraphie, impression, design, objets |
| **Portfolio** (`portfolio.html`) | Grille filtrée par catégorie + charte graphique PDF |
| **À Propos** (`about.html`) | Histoire, équipe, valeurs, localisation Google Maps |
| **Contact** (`contact.html`) | Formulaire WhatsApp, coordonnées, FAQ |
| **Devis** (`devis.html`) | Formulaire multi-étapes par service → envoi WhatsApp |
| **Politique de confidentialité** (`privacy.html`) | Page légale complète |

**Total : 7 pages**

---

## 4. FONCTIONNALITÉS INCLUSES

### Navigation & UX
- Navbar responsive avec menu burger (mobile)
- Bouton flottant WhatsApp sur toutes les pages
- Animations au défilement (IntersectionObserver)
- Transitions fluides entre sections
- Fil d'Ariane sur les pages internes

### Accueil
- Titre animé avec rotation de mots (T-shirts, Bâches, Flyers…)
- Compteurs animés (500+ clients, 4 domaines, 48h livraison)
- Grille portfolio bento (9 photos réelles)
- Bandeau partenaires défilant avec lightbox au clic

### Portfolio
- Filtres par catégorie (Tout / Sérigraphie / Impression / Design / Objets)
- Lightbox photo avec titre, catégorie et description
- Section charte graphique (PDF téléchargeable)
- 15 photos réelles de réalisations FINEX PRO

### Formulaire de devis
- Stepper 3 étapes (Service → Détails → Coordonnées)
- Champs dynamiques selon le service choisi
- Envoi direct sur WhatsApp (+228 90 43 69 29)
- Validation des champs requis

### Bilingue FR / EN
- Commutateur FR/EN dans la navbar
- Traduction complète de tous les textes via `data-i18n`
- Persistance de la langue en session

### SEO & Performance
- Balises meta description sur chaque page
- Titres optimisés pour Lomé / Togo
- Images en `loading="lazy"`
- Favicon SVG (symbole FINEX PRO)

---

## 5. SPÉCIFICATIONS TECHNIQUES

| Élément | Détail |
|---|---|
| **Technologies** | HTML5 / CSS3 / JavaScript Vanilla |
| **Aucun framework** | Pas de React, Vue ou autre — code léger et maintenable |
| **Responsive** | Mobile, tablette, desktop (breakpoints 480 / 768 / 1024px) |
| **Navigateurs** | Chrome, Edge, Firefox, Safari (versions récentes) |
| **Hébergement** | Compatible tout hébergeur Apache / cPanel |
| **Police** | Syne (titres) + DM Sans (corps) — Google Fonts |
| **Couleurs** | Bleu nuit `#0a1628`, Bleu `#14a4ff`, Blanc `#ffffff` |
| **Animations** | CSS keyframes + JS IntersectionObserver |
| **Formulaires** | Redirection WhatsApp (pas de serveur requis) |

---

## 6. LIVRABLES

- [x] 7 fichiers HTML
- [x] 1 fichier CSS global (`style.css`)
- [x] 1 fichier JavaScript global (`script.js`)
- [x] Favicon SVG (symbole du logo)
- [x] Dossier `assets/images/` avec toutes les photos
- [x] Dossier `assets/images/logo/` avec les logos partenaires
- [x] Dossier `assets/charte/` avec la charte graphique PDF
- [x] Fichier `.htaccess` pour configuration serveur

---

## 7. CE QUI N'EST PAS INCLUS

- ❌ Nom de domaine (à souscrire séparément)
- ❌ Hébergement web (à souscrire séparément)
- ❌ Adresse email professionnelle
- ❌ Système de paiement en ligne
- ❌ Espace client / back-office
- ❌ Maintenance mensuelle (peut faire l'objet d'un contrat séparé)

---

## 8. TARIFICATION

| Prestation | Montant |
|---|---|
| Conception & développement du site (7 pages) | 70 000 FCFA |
| Intégration des contenus (textes, photos, logo) | 15 000 FCFA |
| Formulaire devis multi-étapes + WhatsApp | 10 000 FCFA |
| Portfolio filtré + Lightbox + Charte PDF | 5 000 FCFA |
| **TOTAL** | **100 000 FCFA** |

> ⚠️ **Non inclus dans ce forfait :** nom de domaine et hébergement web (tarifs variables selon le prestataire choisi — en moyenne 15 000 à 30 000 FCFA/an au Togo).

---

## 9. CONDITIONS

- **Acompte :** 50% à la commande (50 000 FCFA)
- **Solde :** 50% à la livraison (50 000 FCFA)
- **Délai de livraison :** 7 à 14 jours ouvrés après validation du bon de commande
- **Révisions incluses :** 3 allers-retours de corrections mineurs
- **Propriété :** Le client devient propriétaire du code source à la réception du solde

---

## 10. CONTACTS & VALIDATION

Ce cahier des charges est validé par les deux parties dès signature ou confirmation écrite (WhatsApp / email).

**FINEX PRO** — Lomé, Adidogomé, Togo
📞 +228 90 43 69 29
