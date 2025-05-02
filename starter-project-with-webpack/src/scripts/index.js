// index.js
import '../styles/styles.css';
import App from './pages/app';

const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  document.body.classList.toggle('authenticated', isAuthenticated);
  return isAuthenticated;
};

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const isAuthenticated = checkAuthentication();
  const currentHash = window.location.hash;

  // ✅ Allow #/register and #/about even if not logged in
  if (!isAuthenticated && currentHash !== '#/register' && currentHash !== '#/about') {
    window.location.hash = '#/login';
  } else if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
    window.location.hash = '#/';
  }

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    const isAuthenticated = checkAuthentication();
    const currentHash = window.location.hash;

    // ✅ Allow access to register & about without login
    if (!isAuthenticated && currentHash !== '#/register' && currentHash !== '#/about') {
      window.location.hash = '#/login';
    }

    if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
      window.location.hash = '#/';
    }

    await app.renderPage();
  });
});

// ✅ Logout button
document.addEventListener('click', (e) => {
  if (e.target.id === 'logout-button') {
    localStorage.clear();
    window.location.hash = '#/login';
    location.reload();
  }
});

// ✅ Tampilkan tombol navigasi jika sudah login
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const logoutMenu = document.getElementById("logout-menu");
  const addStoryMenu = document.getElementById("add-story-menu");

  if (token) {
    logoutMenu.style.display = "inline-block";
    addStoryMenu.style.display = "inline-block";
  }
});
