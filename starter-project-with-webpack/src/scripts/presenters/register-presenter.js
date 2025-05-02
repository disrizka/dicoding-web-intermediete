export default class RegisterPresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
  
      this._view.setRegisterFormSubmitHandler(this._onRegister.bind(this));
    }
  
    async _onRegister(name, email, password) {
      try {
        this._view.clearError();
        this._view.showLoading();
  
        const response = await this._model.register(name, email, password);
  
        if (response.error) {
          this._view.hideLoading();
          this._view.showError(response.message);
          return;
        }
  
        this._view.hideLoading();
        this._view.showSuccess('Registration successful! Redirecting to login...');
        this._view.resetForm();
  
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } catch (error) {
        this._view.hideLoading();
        this._view.showError(error.message);
      }
    }
  }
  