$(document).ready(function() {
  // Set the initial text for the typewriter
  var text = "Hello, World!";
  // Split the text into an array of letters
  var letters = text.split("");
  // Initialize the index for the current letter
  var index = 0;
  // Set the interval for the typewriter effect
  var interval = setInterval(function() {
    // Get the current letter
    var letter = letters[index];
    // Add the letter to the typewriter element
    $("#typewriter").append("<span class='letter'>" + letter + "</span>");
    // Fade out the current letter
    $("#letter").animate({opacity: 0}, 1000);
    // Increment the index for the current letter
    index++;
    // Check if we've reached the end of the text
    if (index >= letters.length) {
      clearInterval(interval);
    }
  }, 200);
});
