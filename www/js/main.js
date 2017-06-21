$(document).ready(function()
{

	$.mobile.defaultPageTransition = 'slide';

	$('a').on('vclick', function(event)
	{
		event.preventDefault();

		if ($(this).attr('href') == '#back')
			window.history.back();
		else if ($(this).attr('href'))
			$.mobile.navigate($(this).attr('href'));
	});


	Main.intialize();
});


$.mobile.defaultPageTransition = 'slide';

$('a').on('vclick', function(event)
{
	event.preventDefault();

	if ($(this).attr('href') == '#back')
		window.history.back();
	else if ($(this).attr('href'))
		$.mobile.navigate($(this).attr('href'));
});
var Main = {
	intialize: function()
	{
		Dictionary.load();
	}


};