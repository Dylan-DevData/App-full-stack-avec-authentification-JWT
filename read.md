# 📝 Todo App — Node.js + Express + PostgreSQL + Auth JWT

Application **full-stack** de gestion de tâches avec **authentification JWT**.

> Projet pédagogique : architecture en couches (models / controllers / routes / middlewares), authentification JWT, base de données PostgreSQL, frontend vanilla JS + TailwindCSS.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancer le projet](#-lancer-le-projet)
- [API Endpoints](#-api-endpoints)
- [Structure du projet](#-structure-du-projet)
- [Concepts clés](#-concepts-clés)
- [Tests manuels](#-tests-manuels)
- [Sécurité](#-sécurité)
- [Améliorations futures](#-améliorations-futures)

---

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription avec email + mot de passe
- ✅ Connexion avec JWT (JSON Web Token)
- ✅ Mot de passe hashé avec **bcrypt** (jamais stocké en clair)
- ✅ Token avec expiration (1h par défaut)
- ✅ Déconnexion côté client

### Todos (CRUD)
- ✅ **C**réer une tâche
- ✅ **L**ire ses tâches
- ✅ **M**odifier (titre / cocher)
- ✅ **S**upprimer
- ✅ **Isolation par utilisateur** : chaque user ne voit QUE ses todos

### Frontend
- ✅ Page login / inscription (onglets)
- ✅ Page todos protégée
- ✅ Interface moderne (TailwindCSS)
- ✅ Gestion auto du token expiré (redirection login)
- ✅ Responsive

---

## 🛠 Stack technique

### Backend
| Techno | Rôle |
|--------|------|
| **Node.js** (v18+) | Runtime JS |
| **Express** | Framework HTTP |
| **PostgreSQL** | Base de données |
| **`pg`** | Driver PostgreSQL |
| **bcrypt** | Hash des mots de passe |
| **jsonwebtoken** | Génération/vérification des JWT |
| **dotenv** | Variables d'environnement |
| **cors** | Autoriser le front à appeler le back |
| **nodemon** (dev) | Redémarrage auto |

### Frontend
| Techno | Rôle |
|--------|------|
| **HTML** | Structure |
| **TailwindCSS** (CDN) | Styles |
| **JavaScript vanilla** | Logique + fetch API |
| **localStorage** | Stockage du token |

### Outils
- **ES Modules** (`import`/`export`)
- **Git** + **GitHub**

---

## 🏗 Architecture

### Architecture en couches (backend)

```
Requête HTTP
     ↓
┌─────────────────┐
│   app.js        │  ← Point d'entrée, middlewares globaux
└─────────────────┘
     ↓
┌─────────────────┐
│   routes/       │  ← Définit les URLs
└─────────────────┘
     ↓
┌─────────────────┐
│ middlewares/    │  ← Vérifications (auth, logs)
└─────────────────┘
     ↓
┌─────────────────┐
│ controllers/    │  ← Logique métier (validation, orchestration)
└─────────────────┘
     ↓
┌─────────────────┐
│   models/       │  ← Requêtes SQL pures
└─────────────────┘
     ↓
┌─────────────────┐
│    db.js        │  ← Pool de connexions
└─────────────────┘
     ↓
┌─────────────────┐
│  PostgreSQL     │  ← Base de données
└─────────────────┘
```

### Principe : séparation des responsabilités

| Couche | Responsabilité | Ne fait PAS |
|--------|----------------|-------------|
| **routes** | Associer URL → controller | ❌ Logique, ❌ SQL |
| **middlewares** | Vérifier (auth, logs) avant la route | ❌ Logique métier |
| **controllers** | Valider, orchestrer, répondre | ❌ SQL direct |
| **models** | Requêtes SQL uniquement | ❌ Validation, ❌ `req`/`res` |
| **db.js** | Connexion PostgreSQL | ❌ Requêtes métier |

---

## 🚀 Installation

### Prérequis

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **PostgreSQL** v14+ → [postgresql.org](https://www.postgresql.org)
- **npm** (fourni avec Node)
- **Git** → [git-scm.com](https://git-scm.com)

Vérifier les installations :
```bash
node --version     # v18+
npm --version
psql --version
git --version
```

### 1. Cloner le repo

```bash
git clone https://github.com/TON_USERNAME/todo-app.git
cd todo-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer la base de données

```bash
psql -U postgres
```

Puis dans psql :

```sql
CREATE DATABASE todo_db;
\c todo_db;

-- Table users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table todos
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lier chaque todo à un user
ALTER TABLE todos
ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

\q
```

### 4. Copier et configurer `.env`

```bash
cp .env.example .env
```

⚠️ **Éditer `.env`** pour mettre ta vraie config (voir [Configuration](#-configuration)).

---

## ⚙ Configuration

### Fichier `.env`

```env
# Serveur
PORT=4000

# PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todo_db
DB_PASSWORD=ton_mot_de_passe
DB_PORT=5432

# JWT
JWT_SECRET=CHANGE_ME
JWT_EXPIRES_IN=1h
```

### 🔐 Générer `JWT_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie la sortie dans `JWT_SECRET=...`. **Ne JAMAIS réutiliser cette valeur ailleurs.**

---

## ▶ Lancer le projet

### Mode développement (2 terminaux)

**Terminal 1 — Backend** :
```bash
npm run dev
```
→ `http://localhost:4000`

**Terminal 2 — Frontend** (dans `front/`) :

Avec **Live Server** (extension VS Code) :
- Clic droit sur `front/index.html` → **Open with Live Server**
- → `http://127.0.0.1:5500`

Ou avec **npx serve** :
```bash
cd front
npx serve -p 5500
```

Ou avec **Python** :
```bash
cd front
python -m http.server 5500
```

### Mode production (backend seul)

```bash
npm start
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:4000
```

### 🔓 Routes publiques (Auth)

#### **POST** `/auth/register` — Inscription

**Body** :
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Réponse 201** :
```json
{
  "user": { "id": 1, "email": "user@example.com", "created_at": "..." },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs** :
- `400` — Email invalide OU mot de passe < 6 caractères
- `409` — Email déjà utilisé

---

#### **POST** `/auth/login` — Connexion

**Body** :
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Réponse 200** :
```json
{
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs** :
- `400` — Email/password manquants
- `401` — Email ou mot de passe incorrect

---

### 🔒 Routes protégées (Todos)

⚠️ **Toutes les requêtes doivent contenir** :
```
Authorization: Bearer <TOKEN>
```

Sans token ou token invalide → **401 Unauthorized**

#### **GET** `/todos` — Lister ses todos

**Réponse 200** :
```json
[
  { "id": 1, "user_id": 1, "title": "...", "completed": false, "created_at": "..." }
]
```

---

#### **GET** `/todos/:id` — Voir une todo

**Réponse 200** : La todo

**Erreurs** : `404` — Todo introuvable OU appartient à un autre user

---

#### **POST** `/todos` — Créer une todo

**Body** :
```json
{ "title": "Apprendre Node.js" }
```

**Réponse 201** : La todo créée

**Erreurs** : `400` — Title manquant ou vide

---

#### **PUT** `/todos/:id` — Modifier une todo

**Body** (tous les champs sont optionnels) :
```json
{ "title": "Nouveau titre", "completed": true }
```

**Réponse 200** : La todo modifiée

**Erreurs** : `404` — Todo introuvable OU appartient à un autre user

---

#### **DELETE** `/todos/:id` — Supprimer une todo

**Réponse 200** :
```json
{ "message": "Todo supprimée", "todo": { ... } }
```

**Erreurs** : `404` — Todo introuvable OU appartient à un autre user

---

## 📁 Structure du projet

```
todo/
├── app.js                          # Point d'entrée backend
├── db.js                           # Pool de connexions PostgreSQL
├── .env                            # Variables d'env (GITIGNORÉ)
├── .env.example                    # Modèle (commité)
├── .gitignore
├── package.json
├── README.md
│
├── models/
│   ├── todoModel.js                # Requêtes SQL todos
│   └── userModel.js                # Requêtes SQL users
│
├── controllers/
│   ├── todoController.js           # Logique todos
│   └── authController.js           # Logique register/login
│
├── middlewares/
│   └── authMiddleware.js           # Vérifie le JWT
│
├── routes/
│   ├── todoRoutes.js               # URLs /todos
│   └── authRoutes.js               # URLs /auth
│
└── front/
    ├── index.html                  # Page login/register
    ├── todos.html                  # Page todos (protégée)
    └── app.js                      # Logique frontend
```

---

## 🧠 Concepts clés

### 🔐 Authentification JWT — le flux complet

```
1. INSCRIPTION (POST /auth/register)
   └→ Mot de passe hashé avec bcrypt
   └→ Stocké en DB (jamais en clair)
   └→ JWT généré et retourné

2. LOGIN (POST /auth/login)
   └→ bcrypt.compare(password, hash_stocké)
   └→ Si OK : JWT généré
   └→ Token contient { id, email, iat, exp }

3. CLIENT
   └→ Stocke le token dans localStorage
   └→ À chaque requête : header "Authorization: Bearer <token>"

4. MIDDLEWARE (authMiddleware)
   └→ jwt.verify(token, SECRET)
   └→ Si OK : req.user = { id, email }
   └→ Si KO : 401 Unauthorized

5. CONTROLLER
   └→ Utilise req.user.id pour filtrer les données
   └→ WHERE user_id = req.user.id
```

### 🧂 Le hashage bcrypt

- Le mot de passe **n'est JAMAIS stocké en clair**
- `bcrypt.hash("secret123", 10)` → `$2b$10$N9qo8uLOick...`
- `bcrypt.compare("secret123", hash)` → `true/false`
- **Salt inclus** : le même mot de passe donne des hashs différents à chaque fois

### 🎫 Le JWT — 3 parties

```
HEADER.PAYLOAD.SIGNATURE
```

| Partie | Contenu | Lisible ? |
|--------|---------|-----------|
| **Header** | `{ alg, typ }` | ✅ Oui (base64) |
| **Payload** | `{ id, email, iat, exp }` | ✅ Oui (base64) |
| **Signature** | `HMACSHA256(header.payload, SECRET)` | ❌ Incassable sans SECRET |

⚠️ **Le payload n'est PAS chiffré** → **ne JAMAIS y mettre** de mot de passe ou de données sensibles.

### 🛡 La signature — comment ça protège

- Un attaquant **peut** voir le payload, le modifier
- **Mais** il ne peut pas recalculer la signature sans `JWT_SECRET`
- Le serveur recalcule la signature → si différente → **rejet**

**Analogie** : sceau de cire royal. Tout le monde peut voir la lettre, mais seul le roi a l'anneau pour faire le sceau.

### 💉 Protection contre l'injection SQL

**TOUJOURS** utiliser des **paramètres préparés** :
```js
// ✅ BON
pool.query('SELECT * FROM todos WHERE id = $1', [id])

// ❌ DANGEREUX
pool.query(`SELECT * FROM todos WHERE id = ${id}`)
```

### 🔒 Isolation par utilisateur (Broken Access Control)

**Chaque requête SQL** doit contenir `user_id = $X` :

```js
// ✅ BON
'SELECT * FROM todos WHERE id = $1 AND user_id = $2'

// ❌ FAILLE : un user peut lire les todos des autres
'SELECT * FROM todos WHERE id = $1'
```

**Règle d'or** : à chaque requête SQL, demande-toi **"est-ce que ça pourrait toucher les données d'un autre user ?"**

### 🚫 Protection contre XSS (frontend)

**TOUJOURS** utiliser `textContent` pour les données utilisateur :
```js
// ✅ BON
span.textContent = todo.title

// ❌ DANGEREUX
span.innerHTML = todo.title
```

---

## 🧪 Tests manuels

### Avec **Thunder Client** (VS Code) — recommandé

Installe l'extension **Thunder Client**, puis crée une collection.

#### Test 1 — Register
- Method : `POST`
- URL : `http://localhost:4000/auth/register`
- Body (JSON) : `{ "email": "test@test.com", "password": "secret123" }`

#### Test 2 — Login
- Method : `POST`
- URL : `http://localhost:4000/auth/login`
- Body : mêmes identifiants
- **Copie le token** de la réponse

#### Test 3 — Créer une todo
- Method : `POST`
- URL : `http://localhost:4000/todos`
- Header : `Authorization: Bearer <TOKEN>`
- Body : `{ "title": "Ma première tâche" }`

#### Test 4 — Lister
- Method : `GET`
- URL : `http://localhost:4000/todos`
- Header : `Authorization: Bearer <TOKEN>`

#### Test 5 — Vérifier la sécurité
- Crée **2 utilisateurs** avec des todos
- Connecte-toi avec user A, essaie `GET /todos/<id_d_un_todo_de_B>` → **404 attendu**

### Avec **curl** (PowerShell)

⚠️ **Sous PowerShell**, utilise `--%` pour éviter les problèmes de guillemets :

```powershell
curl.exe --% -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"secret123\"}"
```

### Avec **REST Client** (VS Code)

Crée `api.http` :

```http
@baseUrl = http://localhost:4000
@token = eyJ...

### Register
POST {{baseUrl}}/auth/register
Content-Type: application/json

{ "email": "test@test.com", "password": "secret123" }

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{ "email": "test@test.com", "password": "secret123" }

### Create todo
POST {{baseUrl}}/todos
Content-Type: application/json
Authorization: Bearer {{token}}

{ "title": "Ma tâche" }

### List todos
GET {{baseUrl}}/todos
Authorization: Bearer {{token}}
```

---

## 🔐 Sécurité — checklist

| Point | Implémenté |
|-------|------------|
| Mot de passe hashé (bcrypt) | ✅ |
| `.env` gitignoré | ✅ |
| JWT signé avec secret | ✅ |
| JWT avec expiration | ✅ |
| Validation des entrées (email, password, title) | ✅ |
| Messages d'erreur génériques (login) | ✅ |
| Requêtes SQL préparées (`$1`, `$2`) | ✅ |
| Isolation par user (`user_id = $X`) | ✅ |
| Pas de `password_hash` dans les réponses | ✅ |
| Front : `textContent` (anti-XSS) | ✅ |
| CORS configuré | ✅ |

### ⚠️ **Non implémenté (à faire en prod)**

- ❌ **HTTPS** (obligatoire en prod)
- ❌ **Rate limiting** (contre brute force)
- ❌ **Refresh tokens** (actuellement : re-login toutes les heures)
- ❌ **Helmet.js** (headers de sécurité)
- ❌ **Validation avancée** (zod, joi)
- ❌ **Logs structurés** (winston, pino)
- ❌ **Blacklist de tokens** (JWT ne peut pas être révoqué individuellement)
- ❌ **2FA** (double authentification)

---

## 🚀 Améliorations futures

### Court terme
- [ ] Filtres (Toutes / En cours / Terminées)
- [ ] Compteur de tâches
- [ ] Modification inline du titre
- [ ] Ajout par Enter
- [ ] Spinner pendant le chargement

### Moyen terme
- [ ] Refresh tokens (access court + refresh long)
- [ ] Changement de mot de passe
- [ ] "Se souvenir de moi"
- [ ] Page profil
- [ ] Tests automatisés (Jest + Supertest)

### Long terme
- [ ] Déploiement (Railway + Vercel)
- [ ] Base de données cloud (Neon / Supabase)
- [ ] Migration vers **TypeScript**
- [ ] Documentation **Swagger / OpenAPI**
- [ ] **Docker** + docker-compose
- [ ] **CI/CD** (GitHub Actions)

---

## 📚 Ressources

### Documentation officielle
- [Node.js](https://nodejs.org/docs/latest/api/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [node-postgres (`pg`)](https://node-postgres.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [TailwindCSS](https://tailwindcss.com/docs)

### Sécurité
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT.io](https://jwt.io) — Pour décoder un token
- [MDN — HTTP Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)

---

## 👤 Auteur

**Ton Nom**
- GitHub : [@ton_username](https://github.com/ton_username)
- Email : ton.email@example.com

---

## 📄 License

MIT — Fais-en ce que tu veux. 🚀

---

## 🙏 Remerciements

Projet pédagogique construit **pas à pas** pour apprendre :
- Architecture backend en couches
- Authentification JWT
- Sécurité web (bcrypt, SQL injection, XSS)
- Frontend vanilla JS

**Bon code !** 💻✨