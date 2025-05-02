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
  
        if (!email || !password) {
          this._view.showError('Email dan password wajib diisi.');
          this._view.hideLoading();
          return;
        }
  
        const response = await this._model.login(email, password);
  
        this._view.hideLoading();
  
        if (response.error) {
          this._view.showError(response.message);
          return;
        }
  
        this._model.saveUserSession(
          response.loginResult.token,
          response.loginResult.userId,
          response.loginResult.name
        );
  
        document.body.classList.add('authenticated');
        if (typeof window.showMenusIfLoggedIn === 'function') {
          window.showMenusIfLoggedIn();
        }
  
        window.location.hash = '#/';
      } catch (error) {
        this._view.hideLoading();
        this._view.showError(error.message);
      }
    }
  }
  