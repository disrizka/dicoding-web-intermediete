export default class AuthModel {
    constructor(api) {
      this._api = api;
    }
  
    async login(email, password) {
      try {
        const response = await this._api.login(email, password);
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw new Error('An error occurred during login. Please try again.');
      }
    }
  
    async register(name, email, password) {
      try {
        const response = await this._api.signUp(name, email, password);
        return response;
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error('An error occurred during registration. Please try again.');
      }
    }
  
    saveUserSession(token, userId, name) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
    }
  
    isUserLoggedIn() {
      return !!localStorage.getItem('token');
    }
  }
  