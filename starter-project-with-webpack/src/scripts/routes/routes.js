import LoginPage from '../pages/auth/login-page.js';
import RegisterPage from '../pages/auth/register-page.js';
import AuthModel from '../models/auth-model.js';
import LoginPresenter from '../presenters/login-presenter.js';
import RegisterPresenter from '../presenters/register-presenter.js';
import * as api from '../data/api.js';

const loginView = new LoginView();
const registerView = new RegisterView();

new LoginPresenter({ view: loginView, model: new AuthModel(api) });
new RegisterPresenter({ view: registerView, model: new AuthModel(api) });

const routes = {
  '#/login': new LoginPage(),
  '#/register': new RegisterPage(),
};

export default routes;
