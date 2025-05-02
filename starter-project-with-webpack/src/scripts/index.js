import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  if (!window.location.hash || window.location.hash === '#/') {
    window.location.hash = '#/login';
  }

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-button') {
      localStorage.clear();
      window.location.hash = '#/login';
      location.reload();
    }
  });
});
