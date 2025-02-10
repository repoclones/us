// achievement.js

// List of achievements
const achievements = {
    'MQ': { 
        text: 'Welcome!',
        condition: function() {
            // Example condition: Always true
            return true;
        }
    },
    'Mg': { // Base64 for '2'
        text: 'I was here before',
        condition: function() {
            return true;
        }
    },
    'Mw': { // Base64 for '2'
        text: 'Bad Apple',
        condition: function() {
            return localStorage.getItem("badapplelol") === '1';
        }
    },
    'NA': { // Base64 for '2'
        text: 'Pat, pat, and pat!',
        condition: function() {
            return localStorage.getItem("pats") > 9;
        }
    },
    'Ng': { // Base64 for '3ta'
        text: 'Nice Job, Unintentional Monster',
        condition: function() {
            return localStorage.getItem("haveyoukilledmonikaneuro") === '1';
        }
    },
    'Nw': { // Base64 for '0time'
        text: 'You monster',
        condition: function() {
            return parseInt(localStorage.getItem("timex"), 10) < 2;
        }
    },
    'OQ': { // Base64 for '2'
        text: 'Cringe Cheater',
        condition: function() {
            return true;
        }
    }
};



// Function to get the list of completed tasks from localStorage
function getCompletedTasks() {
    const completed = localStorage.getItem('completedTasks');
    return completed ? JSON.parse(completed) : [];
}

// Function to add a task to the completed tasks list
function addCompletedTask(taskID) {
    const completed = getCompletedTasks();
    if (!completed.includes(taskID)) {
        completed.push(taskID);
        localStorage.setItem('completedTasks', JSON.stringify(completed));
    }
}

function getAchievement(taskID) {
    // Decode the taskID from Base64
    const decodedTaskID = atob(taskID);

    // Check if the taskID is already completed
    if (getCompletedTasks().includes(taskID)) {
        console.log('Task already completed:', decodedTaskID);
        return;
    }

    // Check if the taskID is valid
    if (achievements[taskID] && achievements[taskID].condition()) {
        const achievementText = achievements[taskID].text;

        // Add the taskID to completed tasks
        addCompletedTask(taskID);

        // Create the achievement box
        var $box = $('<div class="achievement-box">')
            .append('<img src="https://via.placeholder.com/40" class="achievement-icon" width="40" height="40">')
            .append('<div class="achievement-text"><div class="achievement-title">Achievement Get</div><div>' + achievementText + '</div></div>')
            .appendTo('body');

        // Animate the achievement box
        $box.animate({ top: '20px', opacity: 1 }, 500, function() {
            // Fade out after 3 seconds
            setTimeout(function() {
                $box.animate({ top: '-100px', opacity: 0 }, 500, function() {
                    $box.remove();
                });
            }, 3000);
        });
    } else {
        console.error('Invalid taskID or condition not met');
    }
}



function detectDevTools() {
    const threshold = 160;
    const before = new Date().getTime();
    // close devtools pls
    debugger;
    // dont cheat :<
    const after = new Date().getTime();
    if (after - before > threshold) {
        getAchievement('OQ');
    } else {
        setTimeout(detectDevTools, 1000);
    }
}
function welcomes(){
    getAchievement('MQ');
}
setTimeout(welcomes, 3000)

detectDevTools();




