import RegisterView from '../../views/auth/register-view.js';
import RegisterPresenter from '../../presenters/register-presenter.js';
import AuthModel from '../../models/auth-model.js';
import * as api from '../../data/api.js';

export default class RegisterPage {
  constructor() {
    this._view = new RegisterView();
    this._model = new AuthModel(api);
    this._presenter = null;
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    this._view.setupUI();
    this._presenter = new RegisterPresenter({
      view: this._view,
      model: this._model,
    });
  }
}