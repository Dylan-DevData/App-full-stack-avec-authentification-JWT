// test-auth.js — À SUPPRIMER APRÈS
import 'dotenv/config';
import { register, login } from './controllers/authController.js';

// On simule req et res
function fakeReq(body) {
  return { body };
}

function fakeRes() {
  const res = {
    status(code) {
      res._status = code;
      return res;
    },
    json(data) {
      console.log(`HTTP ${res._status || 200} →`, data);
      return res;
    },
  };
  return res;
}

// Test register
console.log('--- REGISTER ---');
await register(
  fakeReq({ email: 'alice@test.com', password: 'secret123' }),
  fakeRes()
);

// Test login OK
console.log('--- LOGIN OK ---');
await login(
  fakeReq({ email: 'alice@test.com', password: 'secret123' }),
  fakeRes()
);

// Test login KO (mauvais mot de passe)
console.log('--- LOGIN KO ---');
await login(
  fakeReq({ email: 'alice@test.com', password: 'mauvais' }),
  fakeRes()
);

// Test login KO (email inconnu)
console.log('--- LOGIN EMAIL INCONNU ---');
await login(
  fakeReq({ email: 'inconnu@test.com', password: 'secret123' }),
  fakeRes()
);

// Test register (email déjà pris)
console.log('--- REGISTER EMAIL DÉJÀ PRIS ---');
await register(
  fakeReq({ email: 'alice@test.com', password: 'autre123' }),
  fakeRes()
);

process.exit(0);