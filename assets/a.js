const achievements = {
    'MQ': { 
        text: 'Welcome!',
        condition: function() {
            // Example condition: Always true
            return true;
        }
    },
    'Mg': { // Base64 for '2'
        text: 'I was here before',
        condition: function() {
            return true;
        }
    },
    'Ng': { // Base64 for '3ta'
        text: 'Nice Job, Unintentional Monster',
        condition: function() {
            return localStorage.getItem("haveyoukilledmonikaneuro") === '1';
        }
    },
    'Nw': { // Base64 for '0time'
        text: 'You`re not CJ at least',
        condition: function() {
            return parseInt(localStorage.getItem("timex"), 10) > 1;
        }
    },
    'MmV4YW1wbGU=': { // Base64 for '2example'
        text: 'Variable Task Completed!',
        condition: function() {
            const exampleVariable = 2; // This should be set dynamically in your actual code
            return exampleVariable === 2;
        }
    },
    'bmV1cm9zYW1hLXRvcA==': { // Base64 for 'neurosama-top'
        text: 'Code Task Completed!',
        condition: function() {
            const actualCode = "neurosama.top"; // This should be set dynamically in your actual code
            switch (actualCode) {
                case "neurosama.top":
                    return true;
                default:
                    return false;
            }
        }
    }
};