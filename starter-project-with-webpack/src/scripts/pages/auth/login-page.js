import LoginView from '../../views/auth/login-view.js';
import LoginPresenter from '../../presenters/login-presenter.js';
import AuthModel from '../../models/auth-model.js';
import * as api from '../../data/api.js';

export default class LoginPage {
  constructor() {
    this._view = new LoginView();
    this._model = new AuthModel(api);
    this._presenter = null;
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    this._view.setupUI();
    this._presenter = new LoginPresenter({
      view: this._view,
      model: this._model,
    });
  }
}
