// achievement.js

function showAchievement(iconUrl, achievementText) {
    // Create the achievement box
    var $box = $('<div class="achievement-box">')
        .append('<img src="' + iconUrl + '" class="achievement-icon" width="40" height="40">')
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
}

$(document).ready(function() {
    // Example usage (comment out or modify as needed)
    // $('#trigger-achievement').on('click', function() {
    //     showAchievement('https://via.placeholder.com/40', 'You completed a task!');
    // });
});
