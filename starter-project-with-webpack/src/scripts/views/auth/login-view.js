export default class LoginView {
  getTemplate() {
    return `
      <section class="container">
        <div class="auth-container">
          <h2>Login</h2>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <div class="form-group">
              <button type="submit" id="loginButton">Login</button>
              <div id="loading" style="display: none;">Loading...</div>
            </div>
            <p id="errorMessage" class="error-message" style="display: none;"></p>
          </form>
          <p class="auth-redirect">
            Don't have an account? <a href="#/register">Register here</a>
          </p>
        </div>
      </section>
    `;
  }

  setupUI() {
    this.form = document.getElementById('loginForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.errorMessage = document.getElementById('errorMessage');
    this.loadingIndicator = document.getElementById('loading');
    this.loginButton = document.getElementById('loginButton');
  }

  setLoginFormSubmitHandler(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value;
      handler(email, password);
    });
  }

  showLoading() {
    this.loadingIndicator.style.display = 'block';
    this.loginButton.disabled = true;
    this.loginButton.textContent = 'Logging in...';
  }

  hideLoading() {
    this.loadingIndicator.style.display = 'none';
    this.loginButton.disabled = false;
    this.loginButton.textContent = 'Login';
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
  }

  clearError() {
    this.errorMessage.textContent = '';
    this.errorMessage.style.display = 'none';
  }
}
