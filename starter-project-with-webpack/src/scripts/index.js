// CSS imports
import '../styles/styles.css';

import App from './pages/app';

// Check for authentication
const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  document.body.classList.toggle('authenticated', isAuthenticated);
  return isAuthenticated;
};

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the app
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  
  // Check authentication status
  checkAuthentication();
  
  // Initial page render
  await app.renderPage();

  // Handle navigation
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});