// src/scripts/index.js
import '../styles/styles.css';
import routes from './routes/routes.js';

const renderCurrentRoute = async () => {
  const hash = window.location.hash.toLowerCase() || '#/login';
  const view = routes[hash];

  console.log('HASH:', hash);
  console.log('VIEW:', view);

  if (!view || typeof view.getTemplate !== 'function') {
    document.getElementById('main-content').innerHTML = '<h2>404 - Page Not Found</h2>';
    return;
  }

  const html = await view.getTemplate();
  document.getElementById('main-content').innerHTML = html;

  // pastikan method ada
  if (typeof view.setupUI === 'function') {
    view.setupUI();
  } else {
    console.warn('setupUI() not found in view');
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded');
  await renderCurrentRoute();
});

window.addEventListener('hashchange', renderCurrentRoute);
