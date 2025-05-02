// src/scripts/pages/app.js
import routes from '../routes/routes';

export default class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this._content = content;
    this._drawerButton = drawerButton;
    this._navigationDrawer = navigationDrawer;

    this._initialAppShell();
  }

  _initialAppShell() {
    this._drawerButton.addEventListener('click', (event) => {
      this._navigationDrawer.classList.toggle('open');
      event.stopPropagation();
    });

    document.body.addEventListener('click', (event) => {
      if (!this._navigationDrawer.contains(event.target) && event.target !== this._drawerButton) {
        this._navigationDrawer.classList.remove('open');
      }
    });
  }

  async renderPage() {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const page = routes[url] || routes['/'];
    
    const html = await page.render();
    this._content.innerHTML = html;
    await page.afterRender();
  }
}
