$(document).ready(function() {
  // Code to execute when the document is ready
  $("#image").click(function() {
    // Create a clone of the image
    var clone = $("<img>").attr("src", "orig.png").addClass("clone");
    // Append the clone to the container
    $(".container").append(clone);
    // Animate the clone to expand and fade away
    clone.css("animation-name", "expand");
  });
});
