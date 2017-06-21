var Utility = {

	oneLetterDifferent: function(wordA, wordB)
	{
		if (wordA.length != 4 || wordB.length != 4)
			return false;

		var diffChars = 0;
		for (var i = 0; i < wordA.length; i++)
		{
			if (wordA.charAt(i) != wordB.charAt(i))
			{
				diffChars++;
				if (diffChars > 1)
					return false;
			}
		}

		if (diffChars == 1)
			return true;
		else
			return false;
	}
}