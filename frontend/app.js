// front/app.js — version avec authentification

const API_URL = 'http://localhost:4000';

// ============ VÉRIFICATION DU TOKEN AU DÉMARRAGE ============
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

// Récupérer l'user depuis localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('user-email').textContent = user.email || '';

// ============ HELPERS ============
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };
}

function handleUnauthorized() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ============ DOM ============
const form      = document.getElementById('todo-form');
const input     = document.getElementById('todo-input');
const list      = document.getElementById('todo-list');
const emptyMsg  = document.getElementById('empty');
const loading   = document.getElementById('loading');
const errorBox  = document.getElementById('error');
const logoutBtn = document.getElementById('logout-btn');

// ============ LOGOUT ============
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// ============ AFFICHAGE D'ERREUR ============
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
  setTimeout(() => errorBox.classList.add('hidden'), 4000);
}

// ============ CRÉATION D'UNE LIGNE HTML ============
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className =
    'flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 transition';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.className = 'w-5 h-5 accent-indigo-600 cursor-pointer';
  checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

  const span = document.createElement('span');
  span.textContent = todo.title;
  span.className = 'flex-1 ' + (todo.completed ? 'line-through text-slate-400' : 'text-slate-800');

  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️';
  delBtn.className = 'hover:scale-125 transition text-xl';
  delBtn.addEventListener('click', () => deleteTodo(todo.id));

  li.append(checkbox, span, delBtn);
  return li;
}

// ============ CHARGER TOUTES LES TODOS ============
async function loadTodos() {
  loading.classList.remove('hidden');
  emptyMsg.classList.add('hidden');
  list.innerHTML = '';

  try {
    const res = await fetch(`${API_URL}/todos`, {
      headers: authHeaders(),
    });

    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const todos = await res.json();
    loading.classList.add('hidden');

    if (todos.length === 0) {
      emptyMsg.classList.remove('hidden');
      return;
    }

    todos.forEach(todo => list.appendChild(createTodoElement(todo)));
  } catch (err) {
    loading.classList.add('hidden');
    showError('Impossible de charger les tâches : ' + err.message);
  }
}

// ============ AJOUTER ============
async function addTodo(title) {
  try {
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ title }),
    });

    if (res.status === 401) return handleUnauthorized();

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    await loadTodos();
  } catch (err) {
    showError(err.message);
  }
}

// ============ TOGGLE ============
async function toggleTodo(id, completed) {
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ completed }),
    });

    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await loadTodos();
  } catch (err) {
    showError(err.message);
  }
}

// ============ SUPPRIMER ============
async function deleteTodo(id) {
  if (!confirm('Supprimer cette tâche ?')) return;
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await loadTodos();
  } catch (err) {
    showError(err.message);
  }
}

// ============ SOUMISSION ============
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  input.value = '';
  await addTodo(title);
});

// ============ DÉMARRAGE ============
loadTodos();