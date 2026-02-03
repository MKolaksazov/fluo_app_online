
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

const themes = ['theme-fluid.css', 'theme-design2.css']; //, 'theme-arctic.css'];
let currentThemeIndex = 0;

function toggleTheme() {
  // Преминаване към следващата тема
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;

  // Смяна на href атрибута на theme-style линка
  const themeLink = document.getElementById('theme-style');
  themeLink.href = themes[currentThemeIndex];

  // Опционално: запазване на избраната тема в localStorage
  localStorage.setItem('selectedTheme', currentThemeIndex);
  Chart.defaults.color = currentThemeIndex == 1 ? 'black' : 'white';
  ChartConfig.defaults.gridColor = currentThemeIndex == 1 ? 'black' : 'white';
  Chart.defaults.borderColor = currentThemeIndex == 1 ? 'black' : 'white';
  var draw = localStorage.draw;
  if (draw) { window[draw](getProtocol()); }
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


