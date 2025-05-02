import LoginView from './login-view';
import LoginPresenter from '../../presenters/login-presenter';
import AuthModel from '../../models/auth-model';
import * as api from '../../data/api';

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