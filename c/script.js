document.addEventListener('DOMContentLoaded', () => {
  const checkboxCaptcha = document.getElementById('checkbox-captcha');
  const checkbox = document.getElementById('checkbox');
  const challengeContainer = document.getElementById('challenge-container');
  const verifyBtn = document.getElementById('verify-btn');
  const challengeGrid = document.querySelector('.challenge-grid');
  const checkboxLoading = document.querySelector('.checkbox-loading');
  const errorMessage = document.getElementById('error-message');
  const refreshBtn = document.getElementById('refresh-btn');
  const audioBtn = document.getElementById('audio-btn');
  
  // Challenge images using the provided neural-themed images
  const imageSets = [
    {
      images: [
        'neur1.png', 'neur2.png', 'neur3.png',
        'neur4.png', 'neur5.png', 'neur6.png',
        'neur7.png', 'neur8.png', 'neur9.png'
      ],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8], // All images are correct
      prompt: 'Android'
    }
  ];
  
  let currentSet = 0;
  let selectedCells = new Set();
  let isVerified = false;
  let isLoading = false;

  function loadChallengeSet() {
    const set = imageSets[currentSet];
    document.querySelector('.challenge-object').textContent = set.prompt;
    challengeGrid.innerHTML = '';
    
    set.images.forEach((image, index) => {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.style.backgroundImage = `url(${image})`;
      cell.style.backgroundSize = 'cover';
      cell.style.backgroundPosition = 'center';
      cell.dataset.index = index;
      challengeGrid.appendChild(cell);
    });
    
    selectedCells.clear();
    errorMessage.classList.remove('active');
  }

  function showLoading() {
    isLoading = true;
    checkboxLoading.classList.add('active');
  }

  function hideLoading() {
    isLoading = false;
    checkboxLoading.classList.remove('active');
  }

  checkboxCaptcha.addEventListener('click', () => {
    if (!isVerified && !isLoading) {
      showLoading();
      setTimeout(() => {
        hideLoading();
        challengeContainer.classList.add('active');
        loadChallengeSet();
      }, 1500);
    }
  });

  challengeGrid.addEventListener('click', (e) => {
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;

    const index = parseInt(cell.dataset.index);
    if (selectedCells.has(index)) {
      selectedCells.delete(index);
      cell.classList.remove('selected');
    } else {
      selectedCells.add(index);
      cell.classList.add('selected');
    }
  });

  verifyBtn.addEventListener('click', () => {
    showLoading();
    
    setTimeout(() => {
      const currentChallenge = imageSets[currentSet];
      // Modified to require all images to be selected
      const isCorrect = selectedCells.size === currentChallenge.correct.length;

      if (isCorrect) {
        challengeContainer.classList.remove('active');
        checkbox.classList.add('checked');
        isVerified = true;
        hideLoading();
        
        const checkmarkPath = document.querySelector('.checkmark-path');
        setTimeout(() => {
          checkmarkPath.style.strokeDashoffset = '0';
        }, 100);
        setTimeout(() => {
          localStorage.setItem('spamRefresh', 0);
          window.location.href = localStorage.getItem("previousURL");
        }, 1000);
      } else {
        hideLoading();
        errorMessage.classList.add('active');
        challengeContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
          challengeContainer.style.animation = '';
          loadChallengeSet();
        }, 500);
      }
    }, 1000);
  });

  refreshBtn.addEventListener('click', () => {
    currentSet = (currentSet + 1) % imageSets.length;
    loadChallengeSet();
  });

  audioBtn.addEventListener('click', () => {
    alert('Audio challenge is not implemented in this demo');
  });

  // Add shake animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);
});