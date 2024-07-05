document.addEventListener('DOMContentLoaded', () => {
    const textOutput = document.getElementById('text-output');
    const numberInput = document.getElementById('number-input');
    const generateButton = document.getElementById('generate-button');
    
    function generateRandomText(array, count) {
      let generatedText = '';
      for (let i = 0; i < count; i++) {
        // Generate a random index based on the array length
        const randomIndex = Math.floor(Math.random() * array.length);
        generatedText += (i < count - 1) ? `${array[randomIndex]}, ` : array[randomIndex];
      }
      textOutput.textContent = generatedText;
    }
  
    // Generate text with default input value on page load
    const guhz = ["abusive","active","adventurous","affectionate","aggressive","ambitious","annoying","anxious","artistic","bossy","brave","calm","cautious","charming","cheerful","compulsive","confident","conservative","courageous","cowardly","creative","cruel","cynical","decisive","determined","direct","domineering","easygoing","emotional","enthusiastic","extroverted","fearful","frank","friendly","funny","generous","gentle","greedy","gregarious","gullible","happy","honest","imaginative","impatient","impulsive","independent","intelligent","introverted","lazy","loyal","mean","modest","moody","nervous","nice","obsessive","optimistic","outgoing","patient","persistent","pessimistic","pompous","practical","rational","reliable","reserved","ruthless","sarcastic","secretive","self-centered","selfish","sensible","sensitive","serious","shy","sincere","sociable","stubborn","superficial","tactful","tactless","thoughtful","witty"];
    generateRandomText(guhz, numberInput.value);
  
    generateButton.addEventListener('click', () => generateRandomText(guhz, numberInput.value));
    numberInput.addEventListener('input', () => generateRandomText(guhz, numberInput.value));
  });

