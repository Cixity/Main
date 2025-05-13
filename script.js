
// UI Animations and Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('.animated-section').forEach(section => {
      observer.observe(section);
    });
  
    // Modal Handling
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close-modal');
  
    closeBtn.onclick = () => {
      modal.classList.add('hidden');
    };
  
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    };
  
    // Password Visibility Toggle
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
  
    // Form Validation
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (validateForm('login', { email, password })) {
        // Handle login with Replit Auth
        handleAuth();
      }
    });
  
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
  
      if (validateForm('register', { username, email, password, confirmPassword })) {
        // Handle registration with Replit Auth
        handleAuth();
      }
    });
  });
  
  // Form Validation Helper
  function validateForm(type, data) {
    const errorElement = document.querySelector(`#${type}-form .error-message`);
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showError(errorElement, 'Please enter a valid email address');
      return false;
    }
  
    // Password validation
    if (data.password.length < 6) {
      showError(errorElement, 'Password must be at least 6 characters long');
      return false;
    }
  
    if (type === 'register') {
      // Username validation
      if (data.username.length < 3) {
        showError(errorElement, 'Username must be at least 3 characters long');
        return false;
      }
  
      // Password confirmation
      if (data.password !== data.confirmPassword) {
        showError(errorElement, 'Passwords do not match');
        return false;
      }
    }
  
    errorElement.textContent = '';
    return true;
  }
  
  // Error Display Helper
  function showError(element, message) {
    element.textContent = message;
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }
  
  // Auth Modal Display
  function showAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    modal.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
  
    if (type === 'login') {
      loginForm.classList.remove('hidden');
    } else {
      registerForm.classList.remove('hidden');
    }
  }
  
  // Switch between login and register forms
  function switchForm(type) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
  
    if (type === 'login') {
      loginForm.classList.remove('hidden');
    } else {
      registerForm.classList.remove('hidden');
    }
  }
  
  // Handle Replit Auth
  function handleAuth() {
    const isAuthenticated = document.cookie.includes('REPL_AUTH');
    
    if (!isAuthenticated) {
      const authContainer = document.getElementById('auth-container');
      if (authContainer) {
        authContainer.classList.remove('hidden');
        authContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Redirect to game or start game
      const modal = document.getElementById('auth-modal');
      modal.classList.add('hidden');
      alert('Authentication successful! 🎮');
    }
  }
  