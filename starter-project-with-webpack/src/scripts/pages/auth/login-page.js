import LoginView from '../../views/auth/login-view.js';
import LoginPresenter from '../../presenters/login-presenter.js';
import AuthModel from '../../models/auth-model.js';
import * as api from '../../data/api.js';

export default class LoginPage {
  constructor() {
    this._view = new LoginView();
    this._model = new AuthModel(api);
    this._presenter = null;
    console.log('[LoginPage] constructed');
  }

  async render() {
    console.log('[LoginPage] render() dipanggil');
    return this._view.getTemplate();
  }

  async afterRender() {
    console.log('[LoginPage] afterRender() dipanggil');
    this._view.setupUI();
    this._presenter = new LoginPresenter({
      view: this._view,
      model: this._model,
    });
  }
}
