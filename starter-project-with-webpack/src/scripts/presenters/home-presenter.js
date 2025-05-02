export default class HomePresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
    }
  
    async render() {
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;
      const html = this._view.getTemplate(isAuthenticated);
      document.getElementById('main-content').innerHTML = html;
  
      if (isAuthenticated) {
        await this._loadAndRenderStories(token);
      }
    }
  
    async _loadAndRenderStories(token) {
      try {
        const response = await this._model.fetchStories(token);
        if (response.error || !response.listStory) {
          this._view.renderError(response.message || 'Failed to load stories');
          return;
        }
        await this._view.renderStories(response.listStory);
        this._view.renderMap(response.listStory);
      } catch (err) {
        console.error(err);
        this._view.renderError('Something went wrong while loading stories.');
      }
    }
  }
  