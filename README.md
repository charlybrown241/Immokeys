# ImmoKeys

ImmoKeys est une plateforme web qui met en relation des étudiants à la recherche d'un logement à Casablanca avec des propriétaires professionnels, en remplacement des intermédiaires informels peu fiables qui dominent aujourd'hui ce marché.

## Contexte et objectifs

- **Confiance** : un propriétaire doit faire certifier son identité (pièce CIN) avant de pouvoir publier une annonce. La validation est 100 % manuelle, réalisée par un administrateur (pas d'OCR dans cette version).
- **Mise en relation simple** : la consultation des annonces est libre, sans compte. Seule l'action « Contacter » (ouverture d'une conversation WhatsApp) nécessite un compte étudiant, et chaque clic est tracé.
- **Pas de paiement réel** : les abonnements (Premium étudiant, Pro propriétaire) sont simulés, sans intégration bancaire.
- **Casablanca uniquement** pour cette version, et une expérience pensée mobile-first plutôt qu'une application native.

Trois rôles cohabitent sur la plateforme : **étudiant**, **propriétaire** et **admin**.

## Stack technique

| Composant       | Technologie                          |
|-----------------|---------------------------------------|
| Backend         | Laravel 12 (PHP)                      |
| Frontend        | React + Inertia.js (SPA sans API REST séparée) |
| Base de données | MySQL                                 |
| Styles          | Tailwind CSS                          |
| Build frontend  | Vite                                  |
| Auth            | Laravel Breeze (stack React)          |
| Tests           | PHPUnit (`php artisan test`)          |
| Qualité de code | Laravel Pint (PSR-12)                 |

## Prérequis

- PHP 8.2 ou supérieur, avec les extensions habituelles de Laravel (`pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, etc.)
- Composer 2.x
- Node.js 18+ et npm
- MySQL 8.x (ou MariaDB équivalent) avec un serveur accessible en local
- Git

## Installation locale pas à pas

1. **Cloner le dépôt**

   ```bash
   git clone <url-du-depot> immokeys
   cd immokeys
   ```

2. **Installer les dépendances PHP**

   ```bash
   composer install
   ```

3. **Installer les dépendances JavaScript**

   ```bash
   npm install
   ```

4. **Copier le fichier d'environnement**

   ```bash
   cp .env.example .env
   ```

5. **Générer la clé d'application**

   ```bash
   php artisan key:generate
   ```

6. **Configurer la base de données MySQL**

   Créer une base vide (par exemple `immokeys`) puis renseigner les identifiants dans `.env` :

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=immokeys
   DB_USERNAME=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   ```

7. **Lancer les migrations et les seeders**

   ```bash
   php artisan migrate --seed
   ```

   Cette commande crée les tables, les rôles, les catégories d'annonces et les comptes de démonstration (voir ci-dessous).

8. **Créer le lien de stockage public**

   Les photos d'annonces sont servies depuis `storage/app/public` ; sans ce lien symbolique, les images des annonces ne s'afficheront pas :

   ```bash
   php artisan storage:link
   ```

9. **Lancer le serveur de développement Vite (assets front)**

   Dans un premier terminal :

   ```bash
   npm run dev
   ```

10. **Lancer le serveur applicatif Laravel**

    Dans un second terminal :

    ```bash
    php artisan serve
    ```

11. **Ouvrir l'application**

    Rendez-vous sur [http://localhost:8000](http://localhost:8000).

> Astuce : `composer run dev` lance en parallèle le serveur PHP, la queue, les logs (`pail`) et Vite en une seule commande, si vous préférez un seul terminal.

## Comptes de démonstration

Les seeders créent trois comptes prêts à l'emploi (mot de passe identique pour les trois : `password`) :

| Rôle         | Email                        | Mot de passe | Particularités                                  |
|--------------|-------------------------------|---------------|--------------------------------------------------|
| Admin        | `admin@immokeys.test`         | `password`    | Accès au back-office (`/admin/dashboard`)         |
| Propriétaire | `proprietaire@immokeys.test`  | `password`    | Déjà certifié (`is_verified`), abonnement Pro actif |
| Étudiant     | `etudiant@immokeys.test`      | `password`    | Abonnement gratuit                                |

## Lancer les tests

```bash
php artisan test
```

## Aller plus loin

Le dossier [`docs/`](docs/guide-utilisateur.md) contient un guide utilisateur qui explique, en langage simple, le parcours propriétaire (inscription, certification CIN, publication d'annonces, suivi des leads) et le parcours étudiant (recherche, consultation d'une annonce, contact WhatsApp), avec des captures d'écran des pages principales.
