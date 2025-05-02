import HomePage from '../pages/home/home-page.js';
import AboutPage from '../pages/about/about-page.js';
import LoginPage from '../pages/auth/login-page.js';
import RegisterPage from '../pages/auth/register-page.js';
import AddStoryPage from '../pages/story/add-story-page.js';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),          // ✅ Panggil LoginPage, bukan View langsung
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
};

export default routes;
