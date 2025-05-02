// src/scripts/routes/routes.js
import LoginView from '../views/auth/login-view.js';
import RegisterView from '../views/auth/register-view.js';
import AuthModel from '../models/auth-model.js';
import LoginPresenter from '../presenters/login-presenter.js';
import RegisterPresenter from '../presenters/register-presenter.js';
import * as api from '../data/api.js';

const loginView = new LoginView();
const registerView = new RegisterView();

// Inject presenter ke view
new LoginPresenter({ view: loginView, model: new AuthModel(api) });
new RegisterPresenter({ view: registerView, model: new AuthModel(api) });

const routes = {
  '#/login': loginView,
  '#/register': registerView,
};

export default routes;
