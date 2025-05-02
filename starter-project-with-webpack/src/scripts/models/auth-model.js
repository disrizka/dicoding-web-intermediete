export default class AuthModel {
    constructor(api) {
      this._api = api;
      this._storageKeys = {
        TOKEN: 'token',
        USER_ID: 'userId',
        NAME: 'name',
      };
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
      localStorage.setItem(this._storageKeys.TOKEN, token);
      localStorage.setItem(this._storageKeys.USER_ID, userId);
      localStorage.setItem(this._storageKeys.NAME, name);
    }
  
    getUserSession() {
      return {
        token: localStorage.getItem(this._storageKeys.TOKEN),
        userId: localStorage.getItem(this._storageKeys.USER_ID),
        name: localStorage.getItem(this._storageKeys.NAME),
      };
    }
  
    clearUserSession() {
      localStorage.removeItem(this._storageKeys.TOKEN);
      localStorage.removeItem(this._storageKeys.USER_ID);
      localStorage.removeItem(this._storageKeys.NAME);
    }
  
    isUserLoggedIn() {
      return !!localStorage.getItem(this._storageKeys.TOKEN);
    }
  
    getToken() {
      return localStorage.getItem(this._storageKeys.TOKEN);
    }
  
    getUserId() {
      return localStorage.getItem(this._storageKeys.USER_ID);
    }
  
    getUserName() {
      return localStorage.getItem(this._storageKeys.NAME);
    }
  }