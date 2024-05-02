document.addEventListener('DOMContentLoaded', function() {
    function updateOutput() {
        const text = document.getElementById('textInput').value;
        const suffix = document.getElementById('suffixText').value;
        const mode = document.querySelector('input[name="textSuffixMode"]:checked').id;
        const skipBlanks = document.getElementById('skipBlankLines').checked;
        let result = '';
      
        switch (mode) {
          case 'lineByLineMode':
            result = text.split(/\r?\n/).map(line => line.trim() === '' && skipBlanks ? '' : line + suffix).join('\n');
            break;
          case 'singleSuffixMode':
            result = text + suffix;
            break;
          case 'paragraphMode':
            result = text.replace(/(.+)(      |$)/g, (match, p1, p2) => p1 + suffix + p2);
            break;
        }
      
        document.getElementById('textOutput').value = result;
      }
  
    // Event listeners for text input and suffix changes
    document.getElementById('textInput').addEventListener('input', updateOutput);
    document.getElementById('suffixText').addEventListener('input', updateOutput);
    const modeRadioButtons = document.querySelectorAll('input[name="textSuffixMode"]');


    modeRadioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', updateOutput);
    });
    function handleFileImport() {
        // Create a file input dynamically
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        
        // Set up a change listener to handle the file selection
        fileInput.addEventListener('change', function(event) {
          var file = event.target.files[0]; // Get the selected file
          if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
              var contents = e.target.result;
              document.getElementById('textInput').value = contents; // Assuming you have a textInput field
              updateOutput(); // Update the output in case your application needs it
            };
            reader.readAsText(file); // Read the file as text
          }
        });
      
        // Simulate a click on the file input to open the file dialog
        fileInput.click();
      }
      
      function handleFileSave(content, filename) {
        // Create a Blob with the content
        var blob = new Blob([content], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        
        // Create a link to download the blob
        var downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        
        // Append and click to download, then remove the link
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      
        // Free up the memory from the blob
        URL.revokeObjectURL(url);
      }
  
    function handleCopyToClipboard(content) {
      navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard!');
      }, (err) => {
        alert('Failed to copy text: ' + err);
      });
    }
  
    // Event listeners for buttons
    document.getElementById('importFile').addEventListener('click', handleFileImport);
    document.getElementById('saveInput').addEventListener('click', () => {
      handleFileSave(document.getElementById('textInput').value, 'input.txt');
    });
    document.getElementById('copyInput').addEventListener('click', () => {
        handleCopyToClipboard(document.getElementById('textInput').value);
    });
    document.getElementById('saveOutput').addEventListener('click', () => {
      handleFileSave(document.getElementById('textOutput').value, 'output.txt');
    });
    document.getElementById('copyOutput').addEventListener('click', () => {
      handleCopyToClipboard(document.getElementById('textOutput').value);
    });
  });