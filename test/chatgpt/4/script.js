$(document).ready(function() {
	// Set up initial game state
	var gameState = {
		story: "Once upon a time, there was a brave adventurer named Bob.",
		choices: [
			{
				text: "Bob decided to explore the dark cave.",
				outcome: [
			"Bob entered the dark cave and discovered a treasure chest. He became rich and lived happily ever after.",
			"Bob got lost in the dark cave and couldn't find his way out. He eventually died of hunger and thirst."
		]
			},
			{
				text: "Bob decided to climb the tall mountain.",
				outcome: ["Bob climbed the tall mountain and reached the summit. He saw a beautiful view and felt accomplished.", "END"]
			},
			{
				text: "Bob decided to take a nap.",
				outcome: "Bob took a nap and had a strange dream about being chased by a giant banana. He woke up feeling confused."
			}
		],
		currentChoice: null,
	};

	// Set up event listener for "Next" button
	$("#next-btn").click(function() {
		if (gameState.currentChoice === null) {
			// Show story and choices for first time
			$(".story").text(gameState.story);
			$("#choice-1").text(gameState.choices[0].text);
			$("#choice-2").text(gameState.choices[1].text);
			$("#choice-3").text(gameState.choices[2].text);
			$(".choices").show();
			$("#next-btn").text("Choose");
		} else {
			// Show outcome of current choice
			var choiceIndex = parseInt(gameState.currentChoice.replace("choice-", "")) - 1;
			var outcome = gameState.choices[choiceIndex].outcome;
			
			// Update game state based on current choice
			gameState.story = outcome;
			gameState.choices = [];
			gameState.currentChoice = null;

			// Show updated story and hide choices
			$(".story").text(outcome);
			$(".choices").hide();
			$("#next-btn").text("Next");
		}
	});

	// Set up event listener for choice buttons
	$("#choice-1").click(function() {
		gameState.currentChoice = "choice-1";
	});
	$("#choice-2").click(function() {
		gameState.currentChoice = "choice-2";
	});
	$("#choice-3").click(function() {
		gameState.currentChoice = "choice-3";
	});
});
