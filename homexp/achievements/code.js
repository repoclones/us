var actualCode = ""
function checkCode() {
    var codeInput = document.getElementById("code21").value;
    var actualCode = codeInput.toLowerCase();
  
    // Check the code against different cases
    switch (actualCode) {
        case "neurosama.top":
            updateStatus("Glad you were here from the start! Here's an achievement!", 'success');
            getAchievement("Mg");
            break;
        case "monika.chr":
            updateStatus("Monika Neuro has been reset.", 'success');
            break;
        case "cakeisinfinite":
            updateStatus("Happy birthday Shiro!", 'success');
            break;
        case "airissaveme":
            updateStatus("Who's Airis?", 'success');
            break;
        case "promote.":
        case "leota":
        case "nicogg":
        case "darkeew":
        case "markooooo":
        case "evilneuro":
        case "suavesumi":
        case "wxp2":
        case "cjmaxik":
        case "_laku.":
        case "matokuroshira":
        case "canruf":
        case "bruh_bruh_bruh_bruh":
        case "fireflightphoenix":
        case "maplesyrup777":
        case "heterochromia420":
        case "funnibunny":
        case "xyvyx":
        case "waya13":
        case "mashaakoshka":
        case "goonum":
        case ".madd":
        case "boss_or_something":
        case "zahnrad":
        case "steventheprogram":
        case "queenpb":
        case "shiro_nya":
        case "mitowo_":
        case "rafieable":
        case "yuru__":
            updateStatus("You're either a chatter or a lurker. Anyways, here's an achievement.", 'success');
            break;
        case "hjalnir":
            updateStatus("The dog is out, oh no.", 'success');
            break;
        
        default:
            updateStatus("Invalid Code", 'failure');
            break;
        }
      }
      



      





      function updateStatus(message, statusClass) {
        // Update the status text with the specified class for color
        var statusText = document.getElementById("statustext");
        statusText.innerHTML = message;
        statusText.className = statusClass;
      }