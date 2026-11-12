-- ============================================================
-- schema.sql — Structure de la base de données Todo App
-- ============================================================
-- Usage :
--   psql -U postgres -d todo_db -f sql/schema.sql
-- ============================================================

-- Suppression (dans le bon ordre à cause des FK)
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- TABLE users
-- ============================================================
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE todos
-- ============================================================
CREATE TABLE todos (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEX (performance)
-- ============================================================
-- Accélère les requêtes "WHERE user_id = X"
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- ============================================================
-- COMMENTAIRES (documentation dans la DB)
-- ============================================================
COMMENT ON TABLE users IS 'Utilisateurs de l''application';
COMMENT ON TABLE todos IS 'Tâches des utilisateurs';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt du mot de passe (JAMAIS en clair)';
COMMENT ON COLUMN todos.user_id IS 'FK vers users.id — chaque todo appartient à UN user';

-- ============================================================
-- FIN
-- ============================================================
\echo '✅ Schema créé avec succès'