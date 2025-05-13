
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
          // Handle login
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
      showError(errorElement, 'Please enter a valid email address');
      return false;
    }

    if (data.password.length < 6) {
      showError(errorElement, 'Password must be at least 6 characters long');
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
  