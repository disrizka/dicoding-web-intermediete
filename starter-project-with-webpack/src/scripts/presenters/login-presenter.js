export default class LoginPresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
  
      this._view.setLoginFormSubmitHandler(this._onLogin.bind(this));
    }
  
    async _onLogin(email, password) {
      try {
        this._view.clearError();
        this._view.showLoading();
  
        const response = await this._model.login(email, password);
  
        if (response.error) {
          this._view.hideLoading();
          this._view.showError(response.message);
          return;
        }
  
        this._model.saveUserSession(
          response.loginResult.token,
          response.loginResult.userId,
          response.loginResult.name
        );
  
        if (typeof window.showMenusIfLoggedIn === 'function') {
          window.showMenusIfLoggedIn();
        }
  
        document.body.classList.add('authenticated');
        window.location.hash = '#/';
      } catch (error) {
        this._view.hideLoading();
        this._view.showError(error.message);
      }
    }
  }