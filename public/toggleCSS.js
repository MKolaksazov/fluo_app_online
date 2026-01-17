
var currentTheme = localStorage.getItem('theme');
var themeLink = document.getElementById('theme-style');

if (currentTheme === '2') { 
  themeLink.href = 'fluid.css';
}
if (currentTheme === '1') {
  themeLink.href = 'css_designs2.css';
}
if (currentTheme === '3') {
  themeLink.href = 'arctic.css';
}

function toggleTheme() {
    const themeLink = document.getElementById('theme-style');
    const currentTheme = localStorage.getItem('theme') || '1';
    
    if (currentTheme === '1') {
        themeLink.href = 'css_designs2.css';
        localStorage.setItem('theme', '2');
    } 
    if (currentTheme === '2') {
        themeLink.href = 'fluid.css';
        localStorage.setItem('theme', '3');
    }
    if (currentTheme === '3') {
        themeLink.href = 'arctic.css';
        localStorage.setItem('theme', '1');
    } 
}

// Tab switching
document.querySelectorAll('.tab-btn-frame').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn-frame').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
  });
});

    // Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    setProtocol();
  });
});



