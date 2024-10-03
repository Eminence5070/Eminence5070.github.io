function switchTheme(theme) {
    const stylesheet = document.getElementById('stylesheet');
    if (theme === 'default') {
        stylesheet.href = 'stylesheets/' + getPathName() + '-default.css';
    } else if (theme === 'quartz') {
        stylesheet.href = 'stylesheets/' + getPathName() + '-quartz.css';
    } else if (theme === 'egypt') {
        stylesheet.href = 'stylesheets/' + getPathName() + '-egypt.css';
    } else if (theme === 'midnight') {
        stylesheet.href = 'stylesheets/' + getPathName() + '-midnight.css';
    } else if (theme === 'crimson') {
        stylesheet.href = 'stylesheets/' + getPathName() + '-crimson.css';
    } else {
        stylesheet.href = 'stylesheets/' + getPathName() + '-default.css';
    }
}

function getPathName() {
    const path = window.location.pathname;
    return path.split('/').pop().split('.')[0];
}
  
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('vertex_theme');
    switchTheme(savedTheme);
});
