// db.js — version ES Modules
import 'dotenv/config';                // ✅ charge le .env (syntaxe B)
import pkg from 'pg';                  // ✅ importe tout pg

const { Pool } = pkg;                  // ✅ extrait Pool — LIGNE MANQUANTE

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('✅ Connecté à PostgreSQL'))
  .catch((err) => console.error('❌ Erreur de connexion PostgreSQL :', err.message));

export default pool;