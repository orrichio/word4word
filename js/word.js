function Word(word)
{
	if (word)
		this.text = word;
	else
		this.text = '';

	this.links = [];

	// for pathfinding
	this.explored = 0;
	this.previous = undefined;
}