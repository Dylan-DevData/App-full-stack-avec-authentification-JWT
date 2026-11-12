// test-user-model.js — À SUPPRIMER APRÈS
import * as User from './models/userModel.js';

// Test 1 : créer
const user = await User.createUser('test@test.com', 'fakehash123');
console.log('1. createUser :', user);

// Test 2 : retrouver par email
const found = await User.findUserByEmail('test@test.com');
console.log('2. findUserByEmail :', found);

// Test 3 : retrouver par id
const byId = await User.findUserById(user.id);
console.log('3. findUserById :', byId);

// Nettoyage (à faire manuellement dans psql après)
console.log('→ Supprime ce user dans psql après test');
process.exit(0);