import { login } from "../../data/api";

export default class LoginPage {
  async render() {
    return `
      <section class="container auth-container">
        <h1>Login</h1>
        
        <div class="auth-form-container">
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                required
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                required
              >
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            
            <p id="error-message" class="error-message"></p>
            
            <div class="auth-redirect">
              <p>Don't have an account? <a href="#/register">Register</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorMessage.textContent = '';
      
      try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;
        
        const response = await login(email, password);
        
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        if (response.error) {
          errorMessage.textContent = response.message;
          return;
        }
        
        // Simpan token ke localStorage
        localStorage.setItem('token', response.loginResult.token);
        localStorage.setItem('userId', response.loginResult.userId);
        localStorage.setItem('name', response.loginResult.name);

        // ✅ Tampilkan tombol navigasi tanpa reload
        if (typeof window.showMenusIfLoggedIn === 'function') {
          window.showMenusIfLoggedIn(); // tampilkan logout & add story
        }

        document.body.classList.add('authenticated');
        window.location.hash = '#/';
        
      } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
        
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Login';
        submitButton.disabled = false;
      }
    });
  }
}
