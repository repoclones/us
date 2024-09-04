// Initialize Game Variables
let kamstatusn = localStorage.getItem("kamstatusn");
let kamscore = localStorage.getItem("kamscore");
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let items = {}; // To hold item data

if (kamstatusn === null) {
    localStorage.setItem('kamstatusn', 0);
    kamstatusn = 0;
}

if (kamscore === null) {
    localStorage.setItem('kamscore', 0);
    kamscore = 0;
}

// Fetch item data
fetch('items.json')
    .then(response => response.json())
    .then(data => {
        items = data.items;
        updateInventory();
        document.getElementById("invButton").style.display = "block"; // Show inventory button when items are loaded
    });

fetch('scenarios.json')
    .then(response => response.json())
    .then(data => {
      loadScenario(data.scenarios);
    });

function loadScenario(scenarios) {
    let scn = Math.floor(Math.random() * scenarios.length);
    let scenario = scenarios[scn];

    document.getElementById('game-content').innerHTML = `
      <h2>${scenario.title}</h2>
      <p>${scenario.body}</p>
      <p id="answers">
        ${scenario.answers.map((answer, index) =>
          `<button onclick="answer(${index + 1}, ${answer.fate})" class="btn btn-dark btn-outline-light">${answer.option}</button>`
        ).join('<br>')}
      </p>
    `;
  }

    
function updateStatus() {
    let statusElement = document.getElementById("status");
    let btnStartElement = document.getElementById("btn-start");

    if (kamstatusn == 1) {
        statusElement.innerHTML = `You are currently banned from playing this game.<br><b>Reason:</b> ` + localStorage.getItem("banReason") + `<br><br>Your score is <gig id="score">` + kamscore + `</gig>.`;
    } else {
        statusElement.innerHTML = `You can now play the game.`;
        btnStartElement.innerHTML = `<button onclick="startGame();" class="btn btn-primary"> Play </button>`;
    }
}

function startGame() {
    localStorage.setItem('kamscore', 0);
    loadScenario();
}

function loadScenarios() {
    let scn = Math.floor(Math.random() * scenarios.length);
    let scenario = scenarios[scn];

    document.getElementById("title").innerText = scenario.title;
    document.getElementById("body").innerText = scenario.body;
    document.getElementById("answers").innerHTML = scenario.answers.map((answer, index) => `<button onclick="answer(${index + 1});" class="btn btn-dark btn-outline-light">${answer}</button>`).join('<br>');
    
    let gameImage = scenario.img ? scenario.img : "null";
    document.getElementById("gameImage").src = gameImage;
}

function answer(num) {
    let scenario = scenarios.find(scn => scn.answers[num - 1]);
    if (scenario) {
        // Fate function call based on the answer
        let outcome = scenario.outcomes[num - 1];
        handleOutcome(outcome);
    }
}

function handleOutcome(outcome) {
    if (outcome === "win") {
        kamscore++;
        localStorage.setItem('kamscore', kamscore);
        document.getElementById("body").innerHTML += `<br><button onclick="loadScenario();" class="btn btn-success">Next Scenario</button>`;
    } else if (outcome === "lose") {
        localStorage.setItem('kamstatusn', 1);
        window.location.href = "index.html";
    }
}

function updateInventory() {
    let inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = '';

    inventory.forEach(id => {
        let item = items.find(i => i.itemID === id);
        if (item) {
            inventoryList.innerHTML += `<li>${item.name} <button onclick="useItem('${item.itemID}');">Use</button></li>`;
        }
    });
}

function useItem(itemID) {
    let item = items.find(i => i.itemID === itemID);
    if (item && item.callback !== "none") {
        loadScript(item.callbackJS, () => {
            window[item.callback]();
        });
    }
}

function loadScript(scriptName, callback) {
    let script = document.createElement('script');
    script.src = scriptName;
    script.onload = callback;
    document.body.appendChild(script);
}

function addItem(id) {
    inventory.push(id);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventory();
}

function removeItem(id) {
    inventory = inventory.filter(item => item !== id);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventory();
}

function toggleInventory() {
    let invGui = document.getElementById("inventoryGui");
    invGui.style.display = invGui.style.display === "none" ? "block" : "none";
}

function disableItem(id) {
    // Logic to disable the item
}


