export default class RegisterView {
  getTemplate() {
    return `
      <section class="container">
        <div class="auth-container">
          <h2>Register</h2>
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required minlength="6" />
            </div>
            <div class="form-group">
              <button type="submit" id="registerButton">Register</button>
              <div id="loading" style="display: none;">Loading...</div>
            </div>
            <p id="errorMessage" class="error-message" style="display: none;"></p>
            <p id="successMessage" class="success-message" style="display: none;"></p>
          </form>
          <p class="auth-redirect">
            Already have an account? <a href="#/login">Login</a>
          </p>
        </div>
      </section>
    `;
  }

  setupUI() {
    this.form = document.getElementById('registerForm');
    this.nameInput = document.getElementById('name');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.errorMessage = document.getElementById('errorMessage');
    this.successMessage = document.getElementById('successMessage');
    this.loadingIndicator = document.getElementById('loading');
    this.registerButton = document.getElementById('registerButton');
  }

  setRegisterFormSubmitHandler(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.nameInput.value.trim();
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value;
      handler(name, email, password);
    });
  }

  showLoading() {
    this.loadingIndicator.style.display = 'block';
    this.registerButton.disabled = true;
  }

  hideLoading() {
    this.loadingIndicator.style.display = 'none';
    this.registerButton.disabled = false;
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
    this.successMessage.style.display = 'none';
  }

  showSuccess(message) {
    this.successMessage.textContent = message;
    this.successMessage.style.display = 'block';
    this.errorMessage.style.display = 'none';
  }

  clearError() {
    this.errorMessage.textContent = '';
    this.errorMessage.style.display = 'none';
  }

  resetForm() {
    this.form.reset();
    this.clearError();
  }
}
