
// Create ambient background music
const createAmbientMusic = () => {
    const audio = new Audio();
    audio.loop = true;
    
    // Change music based on time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      audio.src = 'https://assets.mixkit.co/music/preview/mixkit-morning-mood-123.mp3';
    } else if (hour >= 12 && hour < 18) {
      audio.src = 'https://assets.mixkit.co/music/preview/mixkit-afternoon-relaxation-124.mp3';
    } else {
      audio.src = 'https://assets.mixkit.co/music/preview/mixkit-evening-crickets-125.mp3';
    }
    
    audio.volume = 0.1;
    return audio;
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize ambient music
    const ambientMusic = createAmbientMusic();
    
    // Play music on first interaction
    document.addEventListener('click', () => {
      ambientMusic.play();
    }, { once: true });
    
    // Pet Capy Feature
    const petCapy = document.getElementById('pet-capy');
    const reaction = document.querySelector('.pet-reaction');
    const reward = document.querySelector('.pet-reward');
    let coins = 0;
    
    const reactions = ['❤️', '😊', '😍', '🥰', '✨'];
    const rewards = ['+ 1 coin', '+ 2 coins', 'Love you!', 'So cute!'];
    
    // Set daily mood
    const today = new Date().getDay();
    const moods = ['normal', 'happy', 'sleepy', 'playful', 'hungry', 'excited', 'relaxed'];
    const currentMood = moods[today];
    petCapy.setAttribute('data-mood', currentMood);
    
    petCapy.addEventListener('click', () => {
      // Show random reaction
      reaction.textContent = reactions[Math.floor(Math.random() * reactions.length)];
      reaction.style.opacity = '1';
      
      // Show random reward
      reward.textContent = rewards[Math.floor(Math.random() * rewards.length)];
      reward.style.animation = 'reward 1s ease forwards';
      
      // Add happiness animation
      petCapy.classList.add('happy');
      
      // Increment coins
      coins += Math.floor(Math.random() * 2) + 1;
      
      // Reset animations
      setTimeout(() => {
        reaction.style.opacity = '0';
        reward.style.animation = '';
        petCapy.classList.remove('happy');
      }, 1000);
    });
    // Village animation
    const village = document.getElementById('capybara-village');
    const capybaras = [];
    
    function createCapybara() {
      const capy = document.createElement('div');
      capy.className = 'capy-sprite';
      capy.style.left = Math.random() * 90 + '%';
      capy.style.top = Math.random() * 90 + '%';
      village.appendChild(capy);
      capybaras.push(capy);
    }
  
    for (let i = 0; i < 5; i++) {
      createCapybara();
    }
  
    // Menu interactions
    document.getElementById('play-btn').addEventListener('click', () => {
      const capy = document.querySelector('.play .capy-sprite');
      capy.style.transform = 'translateX(50px)';
      setTimeout(() => window.location.href = '#game', 500);
    });
  
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
  
    // Play button click handler
    document.getElementById('playButton').addEventListener('click', () => {
      window.location.href = 'game/index.html';
    });
  });
  