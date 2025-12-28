
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

function showUserInfo() {
  const role = localStorage.getItem('role') || 'GUEST';
  const username = localStorage.getItem('username');

  const el = document.getElementById('userInfo');

  if (role === 'GUEST') {
    el.innerHTML = '👤 Guest (demo mode)';
  } else {
    el.innerHTML = `👤 ${username} (${role})`;
  }
}

document.addEventListener('DOMContentLoaded', showUserInfo);

