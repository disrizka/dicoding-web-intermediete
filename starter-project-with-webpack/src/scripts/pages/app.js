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
    const hash = window.location.hash.toLowerCase() || '#/login';
    const page = routes[hash] || routes['#/login'];
  
    if (typeof page.render === 'function') {
      const html = await page.render();
      this._content.innerHTML = html;
      if (typeof page.afterRender === 'function') {
        await page.afterRender();
      }
    } else {
      this._content.innerHTML = '<h2>404 - Page Not Found</h2>';
    }
  }
  
}
