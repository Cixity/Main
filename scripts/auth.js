
// Form Validation
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
      icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (validateForm('login', { email, password })) {
          // Store login in localStorage
          const userData = {
            email: email,
            username: 'User', // In a real app, this would come from your database
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          // Store user data in localStorage
          localStorage.setItem('userData', JSON.stringify(userData));
          
          // Redirect to main page
          window.location.href = '../index.html';
        }
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const phone = document.getElementById('register-phone').value;
        const location = document.getElementById('register-location').value;

        if (validateForm('register', { username, email, password, confirmPassword, phone, location })) {
          // Handle registration
          window.location.href = '../index.html';
        }
      });
    }
  });
  
function validateForm(type, data) {
    const errorElement = document.querySelector('.error-message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showError(errorElement, 'Please enter a valid email address (must contain @)');
      return false;
    }

    // Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      showError(errorElement, 'Password must be at least 8 characters with uppercase, lowercase, number and special character');
      return false;
    }

    if (type === 'register') {
      if (data.username.length < 3) {
        showError(errorElement, 'Username must be at least 3 characters long');
        return false;
      }

      if (data.password !== data.confirmPassword) {
        showError(errorElement, 'Passwords do not match');
        return false;
      }

      if (!data.phone || data.phone.length < 8) {
        showError(errorElement, 'Phone number must be at least 8 digits');
        return false;
      }

      if (!data.location) {
        showError(errorElement, 'Please select your country/state');
        return false;
      }
    }
  
    errorElement.textContent = '';
    return true;
  }
  
  function showError(element, message) {
    element.textContent = message;
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }

  // Check if user is logged in
  function checkLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.isLoggedIn) {
      // Update UI elements to show logged in state
      const authButtons = document.getElementById('auth-buttons');
      if (authButtons) {
        authButtons.innerHTML = `
                  <a href="#" class="auth-btn" onclick="logout()">Logout</a>
                  <span class="welcome-message">Welcome, ${userData.username}!</span>
                `;
      }
      
      // Update nav links to show user-specific content
      const navContent = document.querySelector('.nav-content');
      if (navContent) {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
                  <a href="#" class="user-profile">Profile</a>
                  <a href="#" class="user-inventory">Inventory</a>
                `;
        navContent.appendChild(userMenu);
      }
    }
  }

  // Handle logout
  function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    
    // Update UI elements to show logged out state
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
      authButtons.innerHTML = `
                <a href="pages/login.html" class="auth-btn">Login</a>
                <a href="pages/register.html" class="auth-btn register">Register</a>
              `;
    }
    
    // Remove user-specific content
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.remove();
    }
    
    // Redirect to main page
    window.location.href = '../index.html';
  }

  // Make logout function available globally
  window.logout = logout;

  // Check login status when the script loads
  checkLoginStatus();
  