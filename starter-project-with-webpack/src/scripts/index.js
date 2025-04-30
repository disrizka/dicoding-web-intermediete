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

  // Redirect logic saat pertama kali load
  if (!isAuthenticated && currentHash !== '#/register') {
    window.location.hash = '#/login';
  } else if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
    window.location.hash = '#/';
  }

  await app.renderPage();

  // Navigasi hashchange
  window.addEventListener('hashchange', async () => {
    const isAuthenticated = checkAuthentication();
    const currentHash = window.location.hash;

    // Redirect jika belum login, tapi bukan ke halaman register
    if (!isAuthenticated && currentHash !== '#/register') {
      window.location.hash = '#/login';
    }

    // Redirect jika sudah login tapi coba akses login/register
    if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
      window.location.hash = '#/';
    }

    await app.renderPage();
  });
});

// ✅ Tambahkan tombol logout listener
document.addEventListener('click', (e) => {
  if (e.target.id === 'logout-button') {
    localStorage.clear();
    window.location.hash = '#/login';
    location.reload(); // Reset state dan class authenticated
  }
});
