export const data = [
  { id: '!search', type: 'character', name: 'Search', subtitle: 'Search', link: 'search.html' },
  { id: 'characters', type: 'category', name: 'Characters', subtitle: 'Character profiles', items: [
    { id: 'aerin', type: 'character', name: 'Aerin Thales', subtitle: 'Placeholder character', link: './pages/aerin-thales.html', image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?q=80&w=256&auto=format&fit=crop' },
    { id: 'kade', type: 'character', name: 'Surveyor Kade', subtitle: 'Field Cartographer', link: '#' },
    { id: 'iri', type: 'character', name: 'Mechanist Iri', subtitle: 'Iron Conclave Liaison', link: '#' }
  ]},
  { id: 'factions', type: 'category', name: 'Factions', subtitle: 'Organizations & groups', items: [
    { id: 'azure-spire', type: 'faction', name: 'Azure Spire', subtitle: 'Scholarly Order', link: '#' }
  ]},
  { id: 'places', type: 'category', name: 'Places', subtitle: 'Locations & areas', items: [
    { id: 'lumen-city', type: 'place', name: 'Lumen City', subtitle: 'Metropolitan Hub', link: '#' }
  ]}
];

export async function getData() {
  return data;
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getAllItems() {
  const items = [];
  
  // First add all standalone items (non-categories)
  data.forEach(item => {
    if (item.id !== '!search' && item.type !== 'category') {
      items.push(item);
    }
  });
  
  // Then add all items from categories
  data.forEach(item => {
    if (item.type === 'category' && item.items) {
      items.push(...item.items);
    }
  });
  
  return shuffleArray(items);
}

export function getMixedContent() {
  const mixed = [];
  const categories = [];
  const allFolderItems = [];
  
  // Separate categories and collect all folder items
  data.forEach(item => {
    if (item.type === 'category') {
      categories.push(item);
      if (item.items) {
        allFolderItems.push(...item.items);
      }
    } else if (item.id !== '!search') {
      // This shouldn't happen with our current structure, but keep for safety
      allFolderItems.push(item);
    }
  });
  
  // Mix categories and folder items
  const shuffledCategories = shuffleArray(categories);
  const shuffledFolderItems = shuffleArray(allFolderItems);
  
  // Interleave them for better variety
  const maxLength = Math.max(shuffledCategories.length, shuffledFolderItems.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < shuffledFolderItems.length) mixed.push(shuffledFolderItems[i]);
    if (i < shuffledCategories.length) mixed.push(shuffledCategories[i]);
  }
  
  return mixed;
}