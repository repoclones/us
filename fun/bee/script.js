// Number of bees to generate
const numBees = 100;

// Function to generate random values between min and max
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Create bees dynamically
for (let i = 0; i < numBees; i++) {
  const bee = document.createElement("img");
  bee.src = "./bee.gif";
  bee.style.width = "150px";
  bee.style.height = "150px";
  bee.className = "bee";

  // Randomize animation duration and delays
  const animationDuration = random(10, 30); // Between 10s and 30s
  const animationDelay = random(0, 10); // Up to 10s delay

  // Set random animation paths using CSS variables
  bee.style.setProperty("--random-x1", random(-1, 1));
  bee.style.setProperty("--random-y1", random(-1, 1));
  bee.style.setProperty("--random-x2", random(-1, 1));
  bee.style.setProperty("--random-y2", random(-1, 1));
  bee.style.setProperty("--random-x3", random(-1, 1));
  bee.style.setProperty("--random-y3", random(-1, 1));
  bee.style.animation = `fly-random ${animationDuration}s linear infinite`;
  bee.style.animationDelay = `${animationDelay}s`;

  document.body.appendChild(bee);
}
