// index.js
import '../styles/styles.css';
import App from './pages/app';

const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  document.body.classList.toggle('authenticated', isAuthenticated);
  return isAuthenticated;
};

const showMenusIfLoggedIn = () => {
  const token = localStorage.getItem("token");
  const logoutMenu = document.getElementById("logout-menu");
  const addStoryMenu = document.getElementById("add-story-menu");

  if (logoutMenu && addStoryMenu) {
    logoutMenu.style.display = token ? "inline-block" : "none";
    addStoryMenu.style.display = token ? "inline-block" : "none";
  }
};

const handleRouting = () => {
  const isAuthenticated = checkAuthentication();
  const currentHash = window.location.hash;

  const publicRoutes = ['#/register', '#/about', '#/login'];

  if (!isAuthenticated && !publicRoutes.includes(currentHash)) {
    window.location.hash = '#/login';
    return false;
  }

  if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
    window.location.hash = '#/';
    return false;
  }

  return true;
};

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  showMenusIfLoggedIn();

  if (handleRouting()) {
    await app.renderPage();
  }

  window.addEventListener('hashchange', async () => {
    showMenusIfLoggedIn();

    if (handleRouting()) {
      await app.renderPage();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-button') {
      localStorage.clear();
      window.location.hash = '#/login';
      location.reload();
    }
  });
});
