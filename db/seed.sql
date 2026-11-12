-- ============================================================
-- seed.sql — Données de test (DÉVELOPPEMENT UNIQUEMENT !)
-- ============================================================
-- ⚠️ NE JAMAIS exécuter ce fichier en PRODUCTION !
--
-- Usage :
--   psql -U postgres -d todo_db -f sql/seed.sql
--
-- Crée 2 utilisateurs avec des mots de passe en clair :
--   - alice@test.com / secret123
--   - bob@test.com   / secret123
-- ============================================================

-- Nettoyage
TRUNCATE todos, users RESTART IDENTITY CASCADE;

-- ============================================================
-- USERS
-- ============================================================
-- ⚠️ Les hashs ci-dessous correspondent à "secret123"
--    (généré avec bcrypt, cost 10)
--    Ils sont FIXES pour que le seed soit reproductible.
INSERT INTO users (email, password_hash) VALUES
  ('alice@test.com', '$2b$10$rZ5YqX8KvJ5xJ5xJ5xJ5xOqX8KvJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5'),
  ('bob@test.com',   '$2b$10$rZ5YqX8KvJ5xJ5xJ5xJ5xOqX8KvJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5');

-- ============================================================
-- TODOS
-- ============================================================
INSERT INTO todos (user_id, title, completed) VALUES
  -- Alice (user_id = 1)
  (1, 'Apprendre Node.js', true),
  (1, 'Maîtriser PostgreSQL', false),
  (1, 'Coder une app full-stack', false),
  -- Bob (user_id = 2)
  (2, 'Lire la doc Express', true),
  (2, 'Comprendre JWT', false);

\echo '✅ Seed inséré (alice@test.com / bob@test.com, mdp: secret123)'