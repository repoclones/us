
window.addEventListener("load", () => { 
  console.log("i has loaded");
  
  const page = document.getElementById("step4");
  if (hasData()) {
    const data = localStorage.getItem("nspx.data");
    const response = validateData(data);
    if (response){
      const name = localStorage.getItem("nspx.user");
      page.classList.add("verified"); // unlocks the Next button
      document.getElementById("discordStatus").textContent = "Verified as @" + name;
      document.getElementById("verifyDiscord").textContent = "Not you?";
    };
  } else {
    const op = localStorage.getItem("nspx.isDone");
    if (!op) {
     localStorage.setItem("nspx.isDone", true);
     console.log("Process was interrupted.");
     document.getElementById("discordStatus").textContent = "Not verified yet. Failed last time.";
    }
  };
  
  
  });



// before logon
document.getElementById("verifyDiscord").addEventListener("click", async () => {
    const page = document.getElementById("step4");
    page.classList.remove("verified");
    localStorage.removeItem("nspx.isDone");
    // document.domain was here before
    let newWindow = window.open("https://nspx-form.gbp.workers.dev/login/aes/?domain=" + location.host, "Discord Login", "width=800,height=600,resizable=yes");
    document.getElementById("discordStatus").textContent = "Verifying...";
    let loop; // will store the interval ID
  loop = setInterval(() => {
    const op = localStorage.getItem("nspx.isDone");
    if (op) {
      if (hasData()) {
    const data = localStorage.getItem("nspx.data");
    const response = validateData(data);
    if (response){
      const name = localStorage.getItem("nspx.user");
      const page = document.getElementById("step4");
      page.classList.add("verified"); // unlocks the Next button
      document.getElementById("discordStatus").textContent = "Verified as @" + name;
      document.getElementById("verifyDiscord").textContent = "Not you?";
      clearInterval(loop); 
    } else {
      
      console.log("Please try again.");
      document.getElementById("discordStatus").textContent = "Failed. Please refresh and try again.";
      clearInterval(loop); 
    };
  } else {
      console.log("Please try again.");
      document.getElementById("discordStatus").textContent = "Failed. Please refresh and try again.";
      clearInterval(loop); 
  };
      
    }
  }, 1000);

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
    const data = localStorage.getItem("nspx.data");
    
    if (user && data){
      console.log("i has data");
      return true;
    } else {
      console.log("i has no data");
      return false;
    }

}

 async function validateData(data){
            const postData = {data: data}
                try {
                    const response = await fetch(`https://nspx-form.gbp.workers.dev/login/aes/validate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify(postData) 
});
                    if (!response.ok) throw new Error('Not valid');
                    return await response.json();
                } catch (error) {
                    throw error;
                }
            };