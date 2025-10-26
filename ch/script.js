// Enhanced copy-to-clipboard with animation
document.addEventListener("click", (e) => {
  if (!(e.target instanceof Element)) return;
  if (!e.target.classList.contains("btn-copy")) return;

  const input = e.target.closest(".field-row")?.querySelector("input");
  if (!input) return;
  
  navigator.clipboard?.writeText(input.value).then(() => {
    e.target.textContent = "✓ Copied!";
    setTimeout(() => {
      e.target.textContent = "Copy";
    }, 1200);
  });
});

// Add loading animation for avatar
const avatar = document.querySelector('.avatar img');
avatar.addEventListener('load', () => {
  avatar.style.opacity = '1';
});

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', initTheme);