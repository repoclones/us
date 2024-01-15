var audio = document.getElementById("myAudio");
var slider = document.getElementById("myRange");

function playAudio() { 
  audio.play(); 
} 

function pauseAudio() { 
  audio.pause(); 
} 

slider.oninput = function() {
  audio.currentTime = (audio.duration * (this.value / 100));
}

audio.ontimeupdate = function() {
  slider.value = (audio.currentTime / audio.duration) * 100;
}
