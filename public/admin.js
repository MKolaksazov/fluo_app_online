const API = '/api/admin';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token) {
  alert('No access');
  location.href = 'index.html';
}

if (role !== 'ADMIN') {
  alert('Access denied');
  window.location.href = 'index.html';
}

async function api(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * =========================
 * USERS
 * =========================
 */

async function loadUsers() {
  const res = await api(`${API}/users`);
  const users = await res.json();

  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button onclick="deleteUser(${u.id})">❌</button>
        </td>
      </tr>
    `;
  });
}

async function deleteUser(id) {
  if (!confirm('Delete user?')) return;

  await api(`${API}/users/${id}`, { method: 'DELETE' });
  loadUsers();
}

/**
 * =========================
 * DATA
 * =========================
 */

async function loadData() {
  const res = await api(`${API}/data`);
  const data = await res.json();

  const tbody = document.getElementById('dataTable');
  tbody.innerHTML = '';

  data.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.filename}</td>
        <td>${d.username || 'GUEST'}</td>
        <td>${new Date(d.created_at).toLocaleString()}</td>
        <td>
          <button onclick="deleteData(${d.id})">❌</button>
        </td>
      </tr>
    `;
  });
}

async function deleteData(id) {
  if (!confirm('Delete file?')) return;

  await api(`${API}/data/${id}`, { method: 'DELETE' });
  loadData();
}

/**
 * INIT
 */
loadUsers();
loadData();
