


document.getElementById("verifyDiscord").addEventListener("click", async () => {
  const page = document.getElementById("step4");
  if (hasData()) {

  } else {
    
  }
  
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
    const user = localStorage.getItem("nspx.name");
    const data = localStorage.getItem("nspx.data");
    
    if (user && data){
      
    }

}