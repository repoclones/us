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

const input = document.querySelector('.search-input');
const btn = document.getElementById('btnSearch');
const resultsEl = document.getElementById('results');

const DEFAULT_IMG = 'https://placehold.co/96x96?text=%E2%98%85';

function iconFor(type) {
  if (type === 'character') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>';
  if (type === 'faction') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v6H4z"/><path d="M4 14h16v6H4z"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11l9-8 9 8v9H3z"/><path d="M9 21v-6h6v6"/></svg>';
}

function render(items) {
  const tiles = [];
  
  items.forEach(item => {
    if (item.type === 'category') {
      tiles.push(`
        <div class="icon-tile folder" onclick="toggleSearchFolder('${item.id}')" aria-label="${item.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <div>${item.name}</div>
          <div style="font-size:10px; opacity:.6">${item.items?.length || 0} items</div>
        </div>
        <div id="search-folder-${item.id}" class="folder-contents search-folder" style="display:none">
          ${shuffleArray(item.items || []).map(subItem => `
            <a class="icon-tile sub-item" href="${subItem.link}" ${subItem.link === '#' ? 'onclick="event.preventDefault()"' : ''} aria-label="${subItem.name}">
              <img src="${subItem.image || DEFAULT_IMG}" alt="${subItem.name} icon">
              <div>${subItem.name}</div>
              <div style="font-size:11px; opacity:.7">${subItem.subtitle}</div>
            </a>
          `).join('')}
        </div>
      `);
    } else {
      tiles.push(`
        <a class="icon-tile" href="${item.link}" ${item.link === '#' ? 'onclick="event.preventDefault()"' : ''} aria-label="${item.name}">
          <img src="${item.image || DEFAULT_IMG}" alt="${item.name} icon">
          <div style="font-weight:600">${item.name}</div>
          <div style="font-size:12px; opacity:.7">${item.subtitle}</div>
        </a>
      `);
    }
  });
  
  resultsEl.innerHTML = tiles.join('') || '<div>No results.</div>';
}

async function search() {
  const q = (input.value || '').trim().toLowerCase();
  const items = await getData();
  
  let filtered = [];
  
  if (!q) {
    // Show mixed content when no search query
    filtered = getMixedContent();
  } else {
    // Search within categories and individual items from folders
    items.forEach(item => {
      if (item.type === 'category' && item.items) {
        const matchingItems = item.items.filter(subItem =>
          [subItem.name, subItem.subtitle, subItem.type].some(v => v.toLowerCase().includes(q))
        );
        
        // Include all items from folder if any match, or folder name matches
        if (matchingItems.length > 0 || item.name.toLowerCase().includes(q)) {
          filtered.push({
            ...item,
            items: q ? matchingItems : item.items
          });
        }
      }
    });
    
    // Also search standalone items that might exist outside folders
    items.forEach(item => {
      if (item.id !== '!search' && item.type !== 'category' &&
        [item.name, item.subtitle, item.type].some(v => v.toLowerCase().includes(q))) {
        filtered.push(item);
      }
    });
  }
  
  render(filtered);
}

btn.addEventListener('click', search);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') search(); });

// Add folder toggle function to global scope
window.toggleSearchFolder = function(folderId) {
  const folderContent = document.getElementById(`search-folder-${folderId}`);
  const folderTile = event.currentTarget;
  
  if (folderContent.style.display === 'none') {
    folderContent.style.display = 'grid';
    folderTile.classList.add('open');
  } else {
    folderContent.style.display = 'none';
    folderTile.classList.remove('open');
  }
};

// initial
search();