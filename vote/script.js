const config = {
    apiEndpoint: "https://twinswar.gbp.workers.dev/" // Replace with your actual Worker URL
  };
  
  let captchaToken = null;
  let cooldownActive = false;
  const cooldownDuration = 5000; // 5 seconds cooldown
  const messageEl = document.getElementById("message");
  const voteButtons = document.querySelectorAll(".vote-button");
  let currentStats = { teamA: 0, teamB: 0 };
  const testMode = false; // Set to true to simulate votes without API calls
  
  // Load reCAPTCHA token
  function loadCaptcha() {
    grecaptcha.ready(() => {
      grecaptcha.execute("Y6LcVmQArAAAAALYy49qAW8U82gt8o0Gn9qaq1BF_", { action: "vote" }).then(token => {
        captchaToken = token;
      });
    });
  }
  
  // Disable vote buttons
  function disableVoteButtons() {
    voteButtons.forEach(button => (button.disabled = true));
  }
  
  // Enable vote buttons
  function enableVoteButtons() {
    voteButtons.forEach(button => (button.disabled = false));
  }
  
  // Handle vote click
  async function handleVote(team) {
    if (!captchaToken || cooldownActive) return;
  
    disableVoteButtons();
    messageEl.textContent = "Processing your vote...";
  
    try {
      // In test mode, simulate API call
      if (testMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        processVoteResult(team);
      } else {
        const response = await fetch(config.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team, captchaToken }) // Send token to Cloudflare Worker
        });
  
        const result = await response.json();
  
        if (result.success) {
          processVoteResult(team, result.stats);
        } else {
          throw new Error(result.message || "Vote failed");
        }
      }
    } catch (error) {
      messageEl.textContent = `Error: ${error.message}. Please try again.`;
      messageEl.style.color = "red";
      enableVoteButtons();
    }
  
    startCooldown();
  }
  
  // Process vote result
  function processVoteResult(team, updatedStats = null) {
    messageEl.textContent = "Vote recorded successfully!";
    messageEl.style.color = "green";
  
    if (updatedStats) {
      currentStats = updatedStats;
      updateDisplay();
    }
  
    startCooldown();
  }
  
  // Start cooldown
  function startCooldown() {
    cooldownActive = true;
    setTimeout(() => {
      cooldownActive = false;
      enableVoteButtons();
      loadCaptcha(); // Refresh reCAPTCHA token
    }, cooldownDuration);
  }
  
  // Update display
  function updateDisplay() {
    document.getElementById("teamA-votes").textContent = currentStats.teamA;
    document.getElementById("teamB-votes").textContent = currentStats.teamB;
  }
  
  // Initialize
  window.onload = () => {
    loadCaptcha();
  };
  