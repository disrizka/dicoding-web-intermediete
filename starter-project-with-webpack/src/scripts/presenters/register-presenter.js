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
  
        if (!name || !email || !password) {
          this._view.showError('Semua field wajib diisi.');
          this._view.hideLoading();
          return;
        }
  
        const response = await this._model.register(name, email, password);
  
        this._view.hideLoading();
  
        if (response.error) {
          this._view.showError(response.message);
          return;
        }
  
        this._view.showSuccess('Registrasi berhasil! Redirect ke login...');
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