$(document).ready(function() {
  var story = document.getElementById("story");
  var index = 0;
  
  var storyText = [
    "Once upon a time...",
    "There was a princess named Alice...",
    "Who lived in a castle in the kingdom of Neverland...",
    "One day, while taking a walk in the garden...",
    "She stumbled upon a magical rabbit hole..."
  ];
  
  story.innerHTML = storyText[index];
  
  $("#next-btn").click(function() {
    index++;
    if (index >= storyText.length) {
      alert("The end!");
    } else {
      story.innerHTML = storyText[index];
    }
  });
});
