const wnd = document.getElementById("nwindow");

const defaultfiles = `
<ul class="icons">
        <li class="icon">
          <img src="./icons/games.gif" alt="Games" id="folder-games">
          <div class="icon-label">Games</div>
        </li>
        <li class="icon">
          <img src="./icons/pages.png" alt="Pages" id="folder-pages">
          <div class="icon-label">Pages</div>
        </li>
        <li class="icon">
          <img src="./icons/settings.png" alt="Settings" id="app-settings">
          <div class="icon-label">Settings</div>
        </li>
        <li class="icon">
          <img src="./icons/badapple_kage.png" alt="Bad Apple" id="app-ba">
          <div class="icon-label">Bad Apple</div>
        </li>
        <li class="icon">
          <img src="./icons/changelog.png" alt="Changelog" id="app-changelog">
          <div class="icon-label">Changelog</div>
        </li>
        <li class="icon">
          <img src="./icons/calculator.png" alt="Calculator" id="app-lcalc">
          <div class="icon-label">Calculator</div>
        </li>
        
        
        <!-- Add more icons here -->
      </ul>
      <br>
      <ul class="icons">
      <li class="icon">
          <img src="./icons/fumoo.png" alt="Test App" id="app-test">
          <div class="icon-label">Test App</div>
        </li>
      <li class="icon">
          <img src="./icons/fumoo.png" alt="Evil Dance" id="app-evildance">
          <div class="icon-label">Evil Dance</div>
        </li>
        <li class="icon">
          <img src="./icons/fumoo.png" alt="NeuroRoll" id="app-neuroroll">
          <div class="icon-label">NeuroRoll</div>
        </li>
      </ul>
`

const gamefiles = `
<ul class="icons">
        <li class="icon">
          <img src="./icons/fumoo.png" alt="Back" id="back2tops">
          <div class="icon-label">Back</div>
        </li>
        <li class="icon">
          <img src="./icons/smolscared.png" alt="SmolGames" id="app-smolscared">
          <div class="icon-label">???</div>
        </li>
        <li class="icon">
          <img src="./icons/mnicon.png" alt="Monika Neuro" id="ref-monika">
          <div class="icon-label">Monika Neuro</div>
        </li>
        <!-- Add more icons here -->
      </ul>

`

// add all pages
const pagefiles = `
<ul class="icons">
        <li class="icon">
          <img src="./icons/fumoo.png" alt="Back" id="back2tops">
          <div class="icon-label">Back</div>
        </li>
        <li class="icon">
          <img src="./icons/achievements.png" alt="Achievements" id="ref-achievements">
          <div class="icon-label">Achievements</div>
        </li>
        <!-- Add more icons here -->
      </ul>

`


const wp_window = `
 <p>Select your wallpaper below.</p>
      <fieldset>
  <legend>Wallpapers available</legend>
  <div class="field-row">
    <input id="wp1" type="radio" name="wallpaper-ch">
    <label for="wp1">Wallpaper 1</label>
  </div>
  <div class="field-row">
    <input id="wp2" type="radio" name="wallpaper-ch">
    <label for="wp2">Wallpaper 2</label>
  </div>
  <div class="field-row">
    <input id="wp3" type="radio" name="wallpaper-ch">
    <label for="wp3">Wallpaper 3</label>
  </div>
  <div class="field-row">
    <input id="wp4" type="radio" name="wallpaper-ch">
    <label for="wp4">Wallpaper 4</label>
  </div>
</fieldset>
      <section class="field-row" style="justify-content: flex-end">
        <button>Change</button><button>Preview</button><button onclick="settings_btt()">Cancel</button>
      </section>
`

const st_win = ` 
<ul class="icons">
        <li class="icon" id="settings-wallpaper">
          <img src="./icons/change_wallpaper.png" alt="Change Wallpaper">
          <div class="icon-label">Change<br>Wallpaper</div>
        </li>
       <li class="icon">
          <img src="./icons/change_theme.png" alt="Change Theme">
          <div class="icon-label">Change<br>Theme</div>
        </li>
        <!-- Add more icons here (dont forget to change app.js) -->
      </ul>
      `

wnd.innerHTML = defaultfiles;



// Init Wallpaper
// If user's first visit, randomize wallpaper.

/*
 var pating = 0;
    pats = localStorage.getItem("pats");
  if (pats === null) {
        pats = 0;
        localStorage.setItem('pats', 0);
      };
*/

// Example code


// Default Main Window Titles
const t_default = window.location.hostname + " [february-10-2025 smol update]"
const t_games = "Games"
const t_pages = "Pages"

// Games Folder Integration


function defgames(){
  document.getElementById("back2tops").addEventListener("click", back2top);
  document.getElementById("app-smolscared").addEventListener("click", function(){ document.getElementById("w-smolscared").style.display = "block"; });
  document.getElementById("ref-monika").addEventListener("click", function(){ window.location.href = "../monika.html"; });

} 

function folder_games(){
  wnd.innerHTML = gamefiles;
  document.getElementById("title-window").innerHTML = t_games;
  defgames();
}



// End of Games Integration (link folder to default apps)




// Pages Folder Integration


function defpages(){
  document.getElementById("back2tops").addEventListener("click", back2top);
  document.getElementById("ref-achievements").addEventListener("click", function(){ window.location.href = "./achievements"; });
}

function folder_pages(){
  wnd.innerHTML = pagefiles;
  document.getElementById("title-window").innerHTML = t_pages;
  defpages();
}



// End of Games Integration (link folder to default apps)



// Default Apps Integration

function defdef(){
document.getElementById("app-ba").addEventListener("click", function(){ document.getElementById("w-ba").style.display = "block"; });
  
document.getElementById("app-settings").addEventListener("click", function(){ document.getElementById("w-settings").style.display = "block"; });

document.getElementById("app-test").addEventListener("click", function(){ document.getElementById("w-test").style.display = "block"; var agh = document.body;

    agh.style = "animation: shake-it .5s reverse infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);";
});

document.getElementById("app-evildance").addEventListener("click", function(){ document.getElementById("w-evildance").style.display = "block"; });
  
document.getElementById("app-neuroroll").addEventListener("click", function(){ document.getElementById("w-neuroroll").style.display = "block"; });

document.getElementById("app-lcalc").addEventListener("click", function(){ window.location.href = "calculator:"; });
  

  //document.getElementById("folder-games").addEventListener("click", folder_games);
  //document.getElementById("folder-pages").addEventListener("click", folder_pages);
  document.getElementById("title-window").innerHTML = t_default;
};

defdef();



function back2top(){
  wnd.innerHTML = defaultfiles;
  defdef();
}

// End of Integration




// Bad Apple Application
// ---START (ba)





document.getElementById("close-ba").addEventListener("click", function(){ document.getElementById("w-ba").style.display = "none"; });








function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';

    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`Download progress: ${percentComplete.toFixed(2)}%`);
        document.getElementById("progression").value = Math.round(percentComplete.toFixed(2));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Download failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Download error'));
    });

    xhr.send();
  });
}




function BA3() {
  document.getElementById("ba-buttonint1").innerHTML = `<img src="loading_small.gif" style="width: 20px"></img><progress max="100" value="0" id="progression"></progress>`;
 // document.getElementById("close-ba").disabled = "true";
   document.getElementById("badappletxt").innerHTML = "Loading...";
  (() => {
  const audioElement = document.createElement("audio");
  audioElement.style.display = "none";
  audioElement.src = "./output.mp3"; // old cdn: https://web.archive.org/web/20231115133701/https://cdn.discordapp.com/attachments/500416964620189706/809600830730141696/output.mp3
  audioElement.volume = 0.4;
  document.body.append(audioElement);

  audioElement.addEventListener("canplay", () => {
    audioElement.pause();
    downloadFile('https://justforasinglesrtfilebruh.vercel.app/output.srt')
      .then(response => response.text())
      .then(subtitles => {
        let subtitleParts = subtitles.split(/^\n$/gm);
        let loadingElements = Array.from(document.querySelectorAll(".badappletext")).filter(element => "Loading..." === element.textContent);

        if (!loadingElements || loadingElements.length === 0) {
          return console.warn("MESSAGE NOT FOUND");
        }

        let lastLoadingElement = loadingElements[loadingElements.length - 1];
        console.log("RUNNING VIDEO");
        document.getElementById("ba-buttonint1").innerHTML = '';

        const startTime = Date.now();
        let previousTime = Date.now();
        let frameIndex = 0;

        const displaySubtitle = (subtitlePart) => {
          let subtitleLines = subtitlePart.split(/\d$/gm);
          let frameDuration = (++frameIndex * (1 / 30) * 1000);
          let elapsedTime = Date.now() - startTime;

          lastLoadingElement.textContent = subtitleLines[2];
          previousTime = Date.now();

          setTimeout(() => {
            if (subtitleParts.length > 0) {
              displaySubtitle(subtitleParts.shift());
            } else {
             
              console.log("ENDED");
            }
          }, Math.max(frameDuration - elapsedTime, 0));
        };

        audioElement.addEventListener("play", () => {
          previousTime = Date.now();
          displaySubtitle(subtitleParts.shift());
        });

        audioElement.play();
      });
  });
})();
};



// ---END (ba)



// Settings Application
// ---START (settings)

const Settings_Title = "Settings"
const Settings_WP = "Change Wallpaper"




document.getElementById("close-settings").addEventListener("click", settings_exit);

document.getElementById("settings-wallpaper").addEventListener("click", wp_show);


function settings_exit(){
  document.getElementById("w-settings").style.display = "none"; document.getElementById("nwindow-settings").innerHTML = st_win;
  document.getElementById("settings-wallpaper").addEventListener("click", wp_show);
  document.getElementById("title-settings").innerHTML = Settings_Title;
}

// btt = back to top
function settings_btt(){
  document.getElementById("nwindow-settings").innerHTML = st_win;
  document.getElementById("settings-wallpaper").addEventListener("click", wp_show);
  document.getElementById("title-settings").innerHTML = Settings_Title;
}

function wp_show(){
  document.getElementById("nwindow-settings").innerHTML = wp_window;
  document.getElementById("title-settings").innerHTML = Settings_WP;
};



// Brightness Option

// ---END (settings)


// Test App
// ---START (test)





document.getElementById("close-test").addEventListener("click", function(){ document.getElementById("w-test").style.display = "none"; });

document.getElementById("close-evildance").addEventListener("click", function(){ document.getElementById("w-evildance").style.display = "none"; });



// ---END (test)







// SmolScared Game
// ---START (smolscared)




document.getElementById("close-smolscared").addEventListener("click", function(){ document.getElementById("w-smolscared").style.display = "none"; });




// ---END (smolscared)













// Chatroom Window
// ---START (chat)



// ---END







// NeuroRoll DVD
// ---START (neuroroll)

document.getElementById("close-neuroroll").addEventListener("click", function(){ document.getElementById("w-neuroroll").style.display = "none"; });











// ---END







// document.getElementById("myDIV").style.display = "none";

/*
(() => {const a=document.createElement("audio");a.style.display="none",a.src="https://cdn.discordapp.com/attachments/500416964620189706/809600830730141696/output.mp3",a.volume=.4,document.body.append(a),a.addEventListener("canplay",()=>{a.pause(),fetch("./output.srt").then(t=>t.text()).then(t=>{let e=t.split(/^\n$/gm),n=Array.from(document.querySelectorAll(".send")).filter(t=>"bad apple"===t.textContent);if(!n||0===n.length)return console.warn("MESSAGE NOT FOUND");n=n[n.length-1],console.log("RUNNING VIDEO");const o=Date.now();let s=Date.now(),l=0;const c=t=>{let a=t.split(/\d$/gm),p=++l*(1/30)*1e3,d=Date.now()-o;n.textContent=a[2],s=Date.now(),setTimeout(()=>{e.length>0?c(e.shift()):console.log("ENDED")},Math.max(p-d,0))};a.addEventListener("play",()=>{s=Date.now(),c(e.shift())}),a.play()})});})()
*/
