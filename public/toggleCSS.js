function toggleTheme() {
    const themeLink = document.getElementById('theme-style');
    const currentTheme = localStorage.getItem('theme') || '1';
    
    if (currentTheme === '1') {
        themeLink.href = 'css_designs2.css';
        localStorage.setItem('theme', '2');
    } 
    if (currentTheme === '2') {
        themeLink.href = 'fluid.css';
        localStorage.setItem('theme', '1');
    }
 //   if (currentTheme === '3') {
 //       themeLink.href = 'arctic.css';
 //       localStorage.setItem('theme', '1');
 //   } 
}
