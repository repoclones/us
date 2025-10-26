/* ...existing code... */
import { getData, shuffleArray, getMixedContent } from './data.js';

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
}

document.addEventListener('DOMContentLoaded', initTheme);

const grid = document.getElementById('menuGrid');
const DEFAULT_IMG = 'https://placehold.co/96x96?text=%E2%98%85';

function render(items) {
  const tiles = [`<a class="icon-tile" href="search.html" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><line x1="16.65" y1="16.65" x2="21" y2="21"/></svg><div>Search</div></a>`];
  
  // Use mixed content to show both folders and items from folders
  const mixedContent = getMixedContent();
  
  mixedContent.forEach(item => {
    if (item.type === 'category') {
      tiles.push(`
        <div class="icon-tile folder" onclick="toggleFolder('${item.id}')" aria-label="${item.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <div>${item.name}</div>
          <div style="font-size:10px; opacity:.6">${item.items?.length || 0} items</div>
        </div>
        <div id="folder-${item.id}" class="folder-contents" style="display:none">
          ${shuffleArray(item.items || []).map(subItem => `
            <a class="icon-tile sub-item" href="${subItem.link}" ${subItem.link === '#' ? 'onclick="event.preventDefault()"' : ''} aria-label="${subItem.name}">
              <img src="${subItem.image || DEFAULT_IMG}" alt="${subItem.name} icon">
              <div>${subItem.name}</div>
            </a>
          `).join('')}
        </div>
      `);
    } else {
      tiles.push(`
        <a class="icon-tile" href="${item.link}" ${item.link === '#' ? 'onclick="event.preventDefault()"' : ''} aria-label="${item.name}">
          <img src="${item.image || DEFAULT_IMG}" alt="${item.name} icon">
          <div>${item.name}</div>
        </a>
      `);
    }
  });
  
  grid.innerHTML = tiles.join('');
}

// Add folder toggle function to global scope
window.toggleFolder = function(folderId) {
  const folderContent = document.getElementById(`folder-${folderId}`);
  const folderTile = event.currentTarget;
  
  if (folderContent.style.display === 'none') {
    folderContent.style.display = 'grid';
    folderTile.classList.add('open');
  } else {
    folderContent.style.display = 'none';
    folderTile.classList.remove('open');
  }
};

getData().then(render);