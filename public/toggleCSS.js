/*
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
*/
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





// toggleCSS.js - Подобрен скрипт за смяна на теми

const themes = ['theme-fluid.css', 'theme-design2.css', 'theme-arctic.css'];
let currentThemeIndex = 0;

function toggleTheme() {
  // Преминаване към следващата тема
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;

  // Смяна на href атрибута на theme-style линка
  const themeLink = document.getElementById('theme-style');
  themeLink.href = themes[currentThemeIndex];

  // Опционално: запазване на избраната тема в localStorage
  localStorage.setItem('selectedTheme', currentThemeIndex);

  console.log('Theme changed to:', themes[currentThemeIndex]);
}

// Опционално: зареждане на последно избраната тема при стартиране
function loadSavedTheme() {
   const savedIndex = localStorage.getItem('selectedTheme');
   if (savedIndex !== null) {
     currentThemeIndex = parseInt(savedIndex);
     const themeLink = document.getElementById('theme-style');
     themeLink.href = themes[currentThemeIndex];
   }
}

// Извикване при зареждане на страницата
window.addEventListener('DOMContentLoaded', loadSavedTheme);


