const assets = [
  './intro.png',
  './speed.gif',
  './luck-1.png',
  './luck-2.png',
  './luck-3.png',
  './luck-4.png',
  './luck-5.png',
  './luck-6.png'
];

const resultImages = [
  './luck-1.png',  // Great luck
  './luck-2.png',  // Good luck
  './luck-3.png',  // Middle luck
  './luck-4.png',  // Small luck
  './luck-5.png',  // Uncertain luck
  './luck-6.png'   // Bad luck
];

const preloader = document.getElementById('preloader');
const gameContainer = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const rollingScreen = document.getElementById('rolling-screen');
const resultScreen = document.getElementById('result-screen');
const rollButton = document.getElementById('roll-button');
const retryButton = document.getElementById('retry-button');
const resultImage = document.getElementById('result-image');
const loadingProgress = document.querySelector('.loading-progress');
const loadingPercentage = document.getElementById('loading-percentage');
const skipLoadingButton = document.getElementById('skip-loading');

let loadedAssets = 0;

function preloadAssets() {
  return new Promise((resolve) => {
    assets.forEach(src => {
      const img = new Image();
      
      img.onload = () => {
        loadedAssets++;
        const progress = (loadedAssets / assets.length) * 100;
        loadingProgress.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.round(progress)}%`;
        
        if (loadedAssets === assets.length) {
          resolve();
        }
      };

      img.onerror = () => {
        loadedAssets++;
        if (loadedAssets === assets.length) {
          resolve();
        }
      };

      img.src = src;
    });
  });
}

function startGame() {
  preloader.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  showScreen(introScreen);
}

skipLoadingButton.addEventListener('click', startGame);

function showScreen(screen) {
  introScreen.classList.add('hidden');
  rollingScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function getRandomResult() {
  const randomIndex = Math.floor(Math.random() * resultImages.length);
  return resultImages[randomIndex];
}

async function rollLuck() {
  showScreen(rollingScreen);
  
  // Wait for 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Show result
  resultImage.src = getRandomResult();
  showScreen(resultScreen);
}

rollButton.addEventListener('click', rollLuck);
retryButton.addEventListener('click', () => {
  showScreen(introScreen);
});

// Start preloading assets
preloadAssets().then(() => {
  startGame();
});