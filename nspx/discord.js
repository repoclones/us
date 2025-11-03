


document.getElementById("verifyDiscord").addEventListener("click", async () => {
  const page = document.getElementById("step4");
  
  // Example: open Discord OAuth or custom JS verification
  const verified = await yourDiscordVerificationFunction(); // <-- your system

  
});




/*
if (verified) {
    page.classList.add("verified"); // unlocks the Next button
    document.getElementById("verifyDiscord").textContent = "✅ Verified!";
  } else {
    page.classList.remove("verified");
    document.getElementById("verifyDiscord").textContent = "❌ Try again";
  }
*/

function hasData(){
    const user = localStorage.getItem("nspx.user");
    if (user){
      
    }

}