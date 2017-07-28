var Dictionary = {
	list: [],
	load: function()
	{
		var request = new XMLHttpRequest();
		request.open('GET', 'data/dictionary.txt');
		request.send();
		request.onloadend = (function()
		{
			wordList = request.response;
			wordList = wordList.split('\n');
			for (var i = 0; i < wordList.length; i++)
				wordList[i] = wordList[i].trim();

			for (var i = 0; i < wordList.length; i++)
				if (wordList[i].length == 4)
					this.list.push(new Word(wordList[i]));

			this.loadLinks();
		}).bind(this)
	},
	loadLinks: function()
	{
		var request = new XMLHttpRequest();
		request.open("GET", "data/links.dat", true);
		request.responseType = "arraybuffer";
		request.send();
		request.onloadend = (function(event)
		{
			var arrayBuffer = request.response;
			var byteArray = new Int16Array(arrayBuffer);
			var index = 0;
			for (var i = 0; i < byteArray.byteLength; i++)
			{
				if (byteArray[i] == -1)
				{
					index++;
					if (index > this.list.length - 1)
						break;
				}
				else
					Dictionary.list[index].links.push(Dictionary.list[byteArray[i]])
			}
		}).bind(this);
	},

	lookupWord: function(word)
	{
		for (var x in this.list)
			if (this.list[x].text == word)
				return this.list[x];

		return null;
	},
	lookupWordIndex: function(word)
	{
		for (var x in this.list)
			if (this.list[x].text == word)
				return x;

		return null;
	},
	generateDisplayList: function()
	{
		for (var x in this.list)
			$('#list-dictionary').append("<li  class='list-group-item'>" + this.list[x].text + '</li>');
	},
	findPath: function(startWord, endWord)
	{
		var path = [];

		var startWord = this.lookupWord(startWord);
		var endWord = this.lookupWord(endWord);

		if (startWord == null || endWord == null || startWord == endWord)
		{
			return path;
		}

		var wordList = [];
		wordList.push(startWord);

		for (var x in this.list)
		{
			this.list[x].explored = false;
			this.list[x].previous = null;
		}

		startWord.explored = true;
		startWord.explored = true;

		var node;
		while (wordList.length > 0)
		{
			node = wordList.shift();
			for (var i = 0, l = node.links.length; i < l; i++)
			{
				if (node.links[i] == endWord)
				{
					thisWord = node;
					while (thisWord != null)
					{
						path.push(thisWord.text);
						thisWord = thisWord.previous;
					}

					path.reverse();
					path.push(endWord.text);

					return path;
				}
				else if (node.links[i].explored == false)
				{
					wordList.push(node.links[i]);
					node.links[i].explored = true;
					node.links[i].previous = node;
				}
			}
		}

		return path;
	}
};