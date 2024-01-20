const wnd = document.getElementById("nwindow");

const defaultfiles = `
<p>This window lists all the achievements you can get.</p>
      
      <ul class="tree-view" style="height: 300px; overflow: auto;">
        <details>
      <summary><strong>🏆 Types of Achievements 🏆</strong></summary>
      <ul> 
        <details>
           <summary>🔑 External Achievements</summary>
          <ul>
          <li>External Achievements can only be obtained by entering a code.</li>
            
            </ul>
        </details>
                <details>
           <summary>🎉 Website Achievements</summary>
          <ul>
          <li>Website Achievements can only be obtained inside the website.</li>
            </ul>
        </details>
      </ul>
    </details>
        <!-- Achievements Below -->
        <details>
      <summary>🎉 Welcome</summary>
      <ul> 
 <li>Visit the site.</li>
 <li><i>Obtained:</i> <span id="ach001">✔️</span></li>
      </ul>
    </details>
    <details>
      <summary>🔑 I was here before</summary>
      <ul> 
 <li>Enter the previous domain of this website. Only the real ones know.</li>
 <li><i>Obtained:</i> <span id="ach002">❌</span></li>
      </ul>
    </details>
      <details>
      <summary>🎉 Bad Apple</summary>
      <ul> 
 <li>Open Bad Apple and watch until the end.</li>
 <li><i>Obtained:</i> <span id="ach003">❌</span></li>
      </ul>
    </details>
      <details>
      <summary>🎉 Pat, pat, and pat!</summary>
      <ul> 
 <li>Play Neurofumo Patting Simulator and reach 10 pats.</li>
 <li><i>Obtained:</i> <span id="ach004">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 Thank you, Player</summary>
      <ul> 
 <li>Play Monika Neuro.</li>
 <li><i>Obtained:</i> <span id="ach005">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 Nice job, unintentional monster</summary>
      <ul> 
 <li>Kill Monika Neuro by unfocusing the window or tab.</li>
 <li><i>Obtained:</i> <span id="ach006">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 You're not CJ at least</summary>
      <ul> 
 <li>Stay with Monika Neuro for at least 1 second.</li>
 <li><i>Obtained:</i> <span id="ach007">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🔑 The Reset... I need it!</summary>
      <ul> 
 <li>Enter a code that gives a reset to Monika Neuro.</li>
 <li><i>Obtained:</i> <span id="ach008">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 Cringe Cheater</summary>
      <ul> 
 <li>Go to Developer Tools.</li>
 <li><i>Obtained:</i> <span id="ach009">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 Time Impostor</summary>
      <ul> 
 <li>Go to Developer Tools while playing Monika Neuro.</li>
 <li><i>Obtained:</i> <span id="ach010">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 Poke!</summary>
      <ul> 
 <li>Poke a Paccha Neuro.</li>
 <li><i>Obtained:</i> <span id="ach011">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 What was the date again?</summary>
      <ul> 
 <li>Enter a command in Command Prompt Lite that shows the date.</li>
 <li><i>Obtained:</i> <span id="ach011">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 Math</summary>
      <ul> 
 <li>Open Calculator.</li>
 <li><i>Obtained:</i> <span id="ach012">❌</span></li>
      </ul>
    </details>
    <details>
      <summary>🎉 I read it all, let me in already</summary>
      <ul> 
 <li>Read and agree to the warning before playing Troubled Chat Lite.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 What is this game dude...</summary>
      <ul> 
 <li>Play Troubled Chat Lite and finish 3 levels.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 You Tried</summary>
      <ul> 
 <li>Play Minesweeper and lose in any difficulty.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 EZ!</summary>
      <ul> 
 <li>Win in Minesweeper in Easy difficulty.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 lezz goooo</summary>
      <ul> 
 <li>Win in Minesweeper in Medium difficulty.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 NOWAYING</summary>
      <ul> 
 <li>Win in Minesweeper in Hard difficulty.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 Happy birthday Shiro!</summary>
      <ul> 
 <li>Go to happybirthdayshiro.xyz, add /cake to the url, and get the code from there.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Bocchi Quote Literate</summary>
      <ul> 
 <li>Refresh at least 10 bocchi quotes.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 i have the stupid</summary>
      <ul> 
 <li>i have the stupid</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Lunch time i guess</summary>
      <ul> 
 <li>Visit the site when its lunch time.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 WYSI</summary>
      <ul> 
 <li>Click "727" on any text.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Erm</summary>
      <ul> 
 <li>Erm</li>
      </ul>
    </details>
    <details>
      <summary>🎉 You did this before, Vedal</summary>
      <ul> 
 <li>Stab the Neuro.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Wait a second</summary>
      <ul> 
 <li>Don't stab the Neuro.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Deja vu</summary>
      <ul> 
 <li>Stab the Neuro 10 times.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 MY_SECRET</summary>
      <ul> 
 <li>Stab Neuro many times until she spits out the code which will only show once.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Gamba</summary>
      <ul> 
 <li>Spin one time at GambaNeuro.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Jackpot Nuero!</summary>
      <ul> 
 <li>Win 3 Nuero slots.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Jackpot Nwero!</summary>
      <ul> 
 <li>Win 3 Nwero slots.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Jackpot Eliv!</summary>
      <ul> 
 <li>Win 3 Eliv slots.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 YOU WIN!!! PLEASE</summary>
      <ul> 
 <li>Win 3 colored Nueros slot each until you collect them all.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 First Loss</summary>
      <ul> 
 <li>Play Kam Overload and lose once.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 HOW DID YOU LOSE THAT BRO</summary>
      <ul> 
 <li>Play Kam Overload and get 0 points.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Very problem solving</summary>
      <ul> 
 <li>Play Kam Overload and get more than 5 points.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Dev's Best I</summary>
      <ul> 
 <li>Play Kam Overload and get more than 20 points.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Time's up</summary>
      <ul> 
 <li>Play Kam Overload in Time Trial mode and lose all of your time.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Too quick there</summary>
      <ul> 
 <li>Play Kam Overload in Time Trial mode and get 0 points.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Fast Reader</summary>
      <ul> 
 <li>Play Kam Overload in Time Trial mode and get 15 points.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Almost lost track of time I</summary>
      <ul> 
 <li>Play Kam Overload in Time Trial mode and get 35 points.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Epic Cookie Fail</summary>
      <ul> 
 <li>Play Find the Cookies and get 0 cookies.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Cookie Jar</summary>
      <ul> 
 <li>Play Find the Cookies and get 20 cookies.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Feeding the whole family</summary>
      <ul> 
 <li>Play Find the Cookies and get 50 cookies.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 The Cookie Fail</summary>
      <ul> 
 <li>Play Find the Cookies in Time Trial and get 0 cookies.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Reflex Master</summary>
      <ul> 
 <li>Play Find the Cookies in Time Trial and get 20 cookies.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Almost lost track of time II</summary>
      <ul> 
 <li>Play Find the Cookies in Time Trial and get 20 cookies.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Multiverse Cookie Jars</summary>
      <ul> 
 <li>Get 500 cookies overall.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Speedy Cookie Collector</summary>
      <ul> 
 <li>Get 100 cookies in a game in less than 5 minutes.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 What a weird game for a Neuro website</summary>
      <ul> 
 <li>Play NeuroKAM once.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Somehow survived</summary>
      <ul> 
 <li>Get 10 NeuroKAM achievements.</li>
      </ul>
    </details>
    <details>
      <summary>🎉 Broken Reality and Fantasy</summary>
      <ul> 
 <li>Get 30 NeuroKAM achievements.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 Certified Neurocord Citizen</summary>
      <ul> 
 <li>Enter some of the known usernames in Neurocord once. (No display name)</li>
      </ul>
    </details>
    <details>
      <summary>🔑 Classic Sniffer</summary>
      <ul> 
 <li>The SNIFFA master.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 Fumofumofumo</summary>
      <ul> 
 <li>You have acknowledged the fumo of this website.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 name.nuro.rest</summary>
      <ul> 
 <li>Evil's name is Evil. That's it.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 You have unlocked a new role</summary>
      <ul> 
 <li>You have unlocked a new role.</li>
      </ul>
    </details>
    <details>
      <summary>🔑 Wait, that's me</summary>
      <ul> 
 <li>I'm not giving you clues on this one.</li>
      </ul>
    </details>
</ul>
<br>
<section class="field-row" style="justify-content: flex-end">
      <button id="app-code">Enter Code</button>
      <button id="ref-homexp">Back</button>
    </section>
`




wnd.innerHTML = defaultfiles;




/*
 var pating = 0;
    pats = localStorage.getItem("pats");
  if (pats === null) {
        pats = 0;
        localStorage.setItem('pats', 0);
      };
*/




// Default Main Window Titles
const t_default = "Achievements [NaN obtained]"



// Default Apps Integration

function defdef(){
document.getElementById("app-code").addEventListener("click", function(){ document.getElementById("w-code").style.display = "block"; });
  
  document.getElementById("title-window").innerHTML = t_default;
};

defdef();



function back2top(){
  wnd.innerHTML = defaultfiles;
  defdef();
}

// End of Integration









document.getElementById("close-code").addEventListener("click", function(){ document.getElementById("w-code").style.display = "none"; });
document.getElementById("close-code2").addEventListener("click", function(){ document.getElementById("w-code").style.display = "none"; });
document.getElementById("ref-homexp").addEventListener("click", function(){ window.location.href = "../"; });




