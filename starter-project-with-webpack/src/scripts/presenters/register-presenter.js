export default class RegisterPresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
  
      this._bindEvents();
    }
  
    _bindEvents() {
      this._view.setRegisterFormSubmitHandler(this._onRegister.bind(this));
    }
  
    async _onRegister(name, email, password) {
      try {
        this._view.clearError();
        this._view.showLoading();
  
        // Validate input
        if (!this._validateInput(name, email, password)) {
          this._view.hideLoading();
          return;
        }
  
        const response = await this._model.register(name, email, password);
  
        if (response.error) {
          this._view.hideLoading();
          this._view.showError(response.message);
          return;
        }
  
        this._view.hideLoading();
        this._view.showSuccess('Registration successful! Redirecting to login...');
        this._view.resetForm();
  
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } catch (error) {
        this._view.hideLoading();
        this._view.showError(error.message || 'Registration failed. Please try again.');
      }
    }
  
    _validateInput(name, email, password) {
      if (!name) {
        this._view.showError('Name is required');
        return false;
      }
  
      if (!email) {
        this._view.showError('Email is required');
        return false;
      }
  
      if (!password) {
        this._view.showError('Password is required');
        return false;
      }
  
      if (password.length < 6) {
        this._view.showError('Password must be at least 6 characters');
        return false;
      }
  
      return true;
    }
  }