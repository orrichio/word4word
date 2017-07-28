/**
 * Created by steveorrichio on 6/28/15.
 */
var Game = {
	difficulty: '',
	usedWords: [], // for checking if the word was submitted

	chooseDifficulty: function(element)
	{
		$('#game-difficulty').html(element.innerHTML);
		this.difficulty = element.innerHTML;
		this.clearPreviousGame();
		this.playGame();
	},
	clearPreviousGame: function()
	{
		//clear the html when starting new game
		$('#game-start-word').html('');
		$('#game-end-word').html('');
		$('#guess').html('');
		$('#game-win').html('');
		$('#game-input').html('');
	},

	playGame: function()
	{
		this.continue();
		$('#guess').click(function() {

		})
		var startWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
		var endWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
		while (!app.FindPath(startWord, endWord))
		{
			console.log('no pair, trying again');
			startWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
			endWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
		}
		console.log('found pair');
		this.usedWords.push(startWord.text);
		$('#game-start-word').html(startWord.text);
		$('#game-end-word').html(endWord.text);
		$('#game-input').keyup(function(e)
		{
			if (this.value.length == 4)
			{
				GameCtrl.submitGuess(this.value, startWord.text, endWord.text);
				this.value = '';
			}
			console.log(this.value);
		})
	},
	continue: function()
	{
		//show continue button
		$('#continue-button').removeClass('ui-screen-hidden');
	},
	submitGuess: function(word, startWord, endWord)
	{
		word = word.toLowerCase();
		var links = app.getPathLinks(startWord, endWord);
		if (Dictionary.lookupWord(word))
		{
			if (Utility.oneLetterDifferent(this.usedWords[this.usedWords.length - 1], word) && word != this.usedWords[this.usedWords.length - 1])
			{
				if (Utility.oneLetterDifferent(this.usedWords[this.usedWords.length - 1], word))
				{
					this.usedWords.push(word);
					$('#guess').append("<div class='glyphicon glyphicon-link'></div><p id" + word + '>' + word + '</p>');
					if (Utility.oneLetterDifferent(links[links.length - 1].text, word))
					{
						$('#guess').append("<img src='assets/help.svg' class='icon-small'");
						$('#game-win').html("<div id='next-game' class='alert alert-success' role='alert'><b>Well done!</b> Next Game -></div>");
					}
				}
				else
				{
					alert('not valid');
				}
			}
		}
	}
};