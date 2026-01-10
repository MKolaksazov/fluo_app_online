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
        <td>
          <select id="uid${u.id}" name="userRole" class="form-control" onchange="upgradeUser('${u.id}', this.value)" >
            <option value="USER" ${u.role === 'USER' ? 'selected' : ''}>USER</option>
            <option value="SUPERUSER" ${u.role === 'SUPERUSER' ? 'selected' : ''}>SUPERUSER</option>
            <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
          </select>
        </td>
        <td>
          <button onclick="deleteUser(${u.id})">❌</button>
        </td>
      </tr>
    `;
  });
}

async function upgradeUser(id, newRole) {
  if (!confirm('Update user?')) return;
  const response = await api(`${API}/users/${id}/role`, { method: 'PATCH' ,
            headers: {  
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
            // Изпращаме генерично име и въведения CSV текст
            body: JSON.stringify({ role: newRole })});
        const result = await response.json();

        if (response.ok) {
            alert(`Update successful!`);
        } else {
            // Обработка на 4xx/5xx статус кодове от бекенда
            if (result.error === "Forbidden") { alert('403: Unauthorized action! Please sign into your account!'); }
            else { alert(`Error: ${result.message || 'Unknown error!'}`); }
        }

  loadUsers();
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
