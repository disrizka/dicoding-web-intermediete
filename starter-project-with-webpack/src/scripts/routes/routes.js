import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-view';
import RegisterPage from '../pages/auth/register-view';
import AddStoryPage from '../pages/story/add-story-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
};

export default routes;
