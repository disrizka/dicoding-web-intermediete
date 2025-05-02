export default class LoginPresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
  
      this._bindEvents();
    }
  
    _bindEvents() {
      this._view.setLoginFormSubmitHandler(this._onLogin.bind(this));
    }
  
    async _onLogin(email, password) {
      try {
        this._view.clearError();
        this._view.showLoading();
  
        // Validate input
        if (!this._validateInput(email, password)) {
          this._view.hideLoading();
          return;
        }
  
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
  
        this._updateAppState();
        
        // Redirect to home page
        window.location.hash = '#/';
      } catch (error) {
        this._view.hideLoading();
        this._view.showError(error.message || 'Login failed. Please try again.');
      }
    }
  
    _validateInput(email, password) {
      if (!email) {
        this._view.showError('Email is required');
        return false;
      }
  
      if (!password) {
        this._view.showError('Password is required');
        return false;
      }
  
      return true;
    }
  
    _updateAppState() {
      // Update UI to show authenticated state
      document.body.classList.add('authenticated');
      
      // Call global function if it exists
      if (typeof window.showMenusIfLoggedIn === 'function') {
        window.showMenusIfLoggedIn();
      }
    }
  }