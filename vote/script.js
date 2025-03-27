// DOM Elements
const voteNeuroBtn = document.getElementById('voteNeuro');
const voteEvilBtn = document.getElementById('voteEvil');
const messageEl = document.getElementById('message');
const cooldownTimerEl = document.getElementById('cooldownTimer');
const neuroPercentEl = document.getElementById('neuroPercent');
const evilPercentEl = document.getElementById('evilPercent');
const neuroCountEl = document.getElementById('neuroCount');
const evilCountEl = document.getElementById('evilCount');

// State variables
let cooldownActive = false;
let cooldownInterval = null;
const cooldownSeconds = 30;
const apiEndpoint = "https://twinswar.gbp.workers.dev/vote";

// Initialize
updateDisplay();

// Event listeners
voteNeuroBtn.addEventListener('click', () => handleVote('neuro'));
voteEvilBtn.addEventListener('click', () => handleVote('evil'));

// ✅ Attach `onRecaptchaLoad` to `window`
window.onRecaptchaLoad = function () {
  if (typeof grecaptcha === "undefined") {
    console.warn("reCAPTCHA script not yet loaded, retrying...");
    setTimeout(window.onRecaptchaLoad, 1000); // Retry after 1 second
    return;
  }

  grecaptcha.render('g-recaptcha', {
    'sitekey': '6LcVmQArAAAAALYy49qAW8U82gt8o0Gn9qaq1BF_',
    'callback': onCaptchaComplete,
    'expired-callback': onCaptchaExpired
  });

  console.log("reCAPTCHA initialized.");
};

// ✅ Load reCAPTCHA dynamically
function loadRecaptcha(callback) {
  const script = document.createElement('script');
  script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

// ✅ Ensure reCAPTCHA loads before usage
loadRecaptcha(() => {
  console.log("reCAPTCHA script loaded.");
});

// Enable vote buttons if reCAPTCHA is completed
function onCaptchaComplete(token) {
  if (!cooldownActive) {
    voteNeuroBtn.disabled = false;
    voteEvilBtn.disabled = false;
    messageEl.textContent = "Captcha verified! You can now vote.";
    messageEl.style.color = "green";
  }
}

// Disable vote buttons if reCAPTCHA expires
function onCaptchaExpired() {
  voteNeuroBtn.disabled = true;
  voteEvilBtn.disabled = true;
  messageEl.textContent = "Captcha expired. Please solve again.";
  messageEl.style.color = "#cc0000";
}

// Handle the voting process
async function handleVote(team) {
  if (cooldownActive) return;

  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse) {
    messageEl.textContent = "Please complete the captcha.";
    messageEl.style.color = "red";
    return;
  }

  disableVoteButtons();
  messageEl.textContent = "Processing your vote...";

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team, captchaResponse })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      processVoteResult(result.stats);
    } else {
      throw new Error(result.message || 'Vote failed');
    }
  } catch (error) {
    messageEl.textContent = `Error: ${error.message}. Please try again.`;
    messageEl.style.color = "red";
    if (!cooldownActive) enableVoteButtons();
  } finally {
    grecaptcha.reset();
  }
}

// Process the vote result and update the display
function processVoteResult(stats) {
  updateDisplay(stats);
  startCooldown();
  messageEl.textContent = "Vote recorded successfully!";
  messageEl.style.color = "green";
}

// Update the display with the latest vote counts and percentages
function updateDisplay(stats = { neuro: 50, evil: 50, neuroCount: 0, evilCount: 0 }) {
  neuroPercentEl.textContent = `${stats.neuro.toFixed(1)}%`;
  evilPercentEl.textContent = `${stats.evil.toFixed(1)}%`;
  neuroCountEl.textContent = `${stats.neuroCount} votes`;
  evilCountEl.textContent = `${stats.evilCount} votes`;
}

// Start the cooldown period after voting
function startCooldown() {
  cooldownActive = true;
  disableVoteButtons();

  let timeLeft = cooldownSeconds;
  updateCooldownDisplay(timeLeft);

  clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    timeLeft--;
    updateCooldownDisplay(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(cooldownInterval);
      cooldownActive = false;
      cooldownTimerEl.textContent = "";
      enableVoteButtons();
    }
  }, 1000);
}

// Update the cooldown timer display
function updateCooldownDisplay(seconds) {
  cooldownTimerEl.textContent = `Cooldown: ${seconds} seconds remaining`;
}

// Enable vote buttons
function enableVoteButtons() {
  voteNeuroBtn.disabled = false;
  voteEvilBtn.disabled = false;
}

// Disable vote buttons
function disableVoteButtons() {
  voteNeuroBtn.disabled = true;
  voteEvilBtn.disabled = true;
}
