const dialogueBox = document.querySelector('.character-sprite');
const characterName = document.querySelector('.character-name');
const text = document.querySelector('.text');
let dialogueIndex = 0;

dialogueBox.addEventListener('click', () => {
  dialogueIndex++;
  switch (dialogueIndex) {
    case 1:
      characterName.textContent = 'Character Name';
      text.textContent = 'Dialogue Text 1';
      break;
    case 2:
      characterName.textContent = 'Another Character Name';
      text.textContent = 'Dialogue Text 2';
      break;
    case 3:
      characterName.textContent = 'Character Name';
      text.textContent = 'Dialogue Text 3';
      break;
    default:
      dialogueIndex = 0;
      break;
  }
});
