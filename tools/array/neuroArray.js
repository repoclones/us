document.addEventListener('DOMContentLoaded', function() {
    var textInput = document.getElementById('textInput');
    var arrayOutput = document.getElementById('arrayOutput');
    var quoteInputs = document.querySelectorAll('input[name="quoteType"]');
    function updateArrayOutput() {
        var quoteType = document.querySelector('input[name="quoteType"]:checked').value;
        var lines = textInput.value.split(/\r?\n/);
        var arrayString = lines.map(line => `${quoteType}${line}${quoteType}`).join(',');
        arrayOutput.value = `[${arrayString}]`;
    }

    textInput.addEventListener('input', updateArrayOutput);

    quoteInputs.forEach(function(input) {
        input.addEventListener('change', updateArrayOutput);
    });

    // Initialize output
    updateArrayOutput();
});