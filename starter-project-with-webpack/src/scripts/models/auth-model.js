export default class AuthModel {
    constructor(api) {
      this._api = api;
    }
  
    async login(email, password) {
      return await this._api.login(email, password);
    }
  
    async register(name, email, password) {
      return await this._api.signUp(name, email, password);
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
  