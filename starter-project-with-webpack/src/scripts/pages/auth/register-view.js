import RegisterView from './register-view';
import RegisterPresenter from '../../presenters/register-presenter';
import AuthModel from '../../models/auth-model';
import * as api from '../../data/api';

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