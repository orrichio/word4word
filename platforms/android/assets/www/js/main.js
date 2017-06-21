/**
 * Created by Steve on 6/23/2015.
 */

//call on load of DOM
$(document).ready( function(){
    $.mobile.defaultPageTransition = 'slide';
    //$('#button-play').on('vclick', function(event){
    //    GameCtrl.chooseDifficulty(this);
    //})
    //$("#refresh-game").on("vclick", function(){
    //    GameCtrl.clearPreviousGame();
    //    GameCtrl.playGame()
    //});
    //$("#next-game").on("vclick", function(){
    //    GameCtrl.clearPreviousGame();
    //    GameCtrl.playGame()
    //});
    // Define a click binding for all anchors in the page
    $("a").on( "vclick", function( event ) {
        event.preventDefault();
        $.mobile.navigate( $(this).attr( "href" ));
    });
    $('nav button').on('vclick', function(event){
            window.history.back();
        }
    );

    $('#page-play').on('pageshow', function () {

        console.log('help me jes');
    })



        app.intialize();


});


var DictionaryWords = [];
var Dictionary = [];
var VulgarWords = [
    "anus", "cunt", "cock", "coon",
    "arse", "damn", "gook", "dike",
    "fuck", "homo", "jizz", "muff",
    "piss", "poon", "shit", "slut",
    "rape", "tits", "wank", "twat",
    "piss", "porn", "ashy", "clit",
    "anal", "dick", "fags", "sexy",
    "pube","dyke"
];
var app = {

intialize:function(){
    this.LoadDictionary();
},

isVulgarWord: function (word) {
    for (var y = 0; y < VulgarWords.length; y++)
        if (word == VulgarWords[y])
            return true;

    return false;
},

linkDictionary: function(){
    for(var i in Dictionary){
        for(var j in Dictionary){
            if(app.OneLetterDifferent(Dictionary[i].text,Dictionary[j].text)){
                Dictionary[i].links.push(Dictionary[j]);
            }
        }
    }
},
searchDictionary: function(){
    var searchWords = [];
    for(var x in Dictionary)
        searchWords.push(Dictionary[x].text);
},

LoadDictionary: function () {
    var request = new XMLHttpRequest();
    request.open("GET", "data/dictionary.txt");
    request.send();
    request.onloadend = function () {
        wordList = request.response;
        wordList = wordList.split('\n');
        for (var i = 0; i < wordList.length; i++)
            wordList[i] = wordList[i].trim();

        for (var i = 0; i < wordList.length; i++)
            if (wordList[i].length == 4)
                if(!app.isVulgarWord(wordList[i]))
                    Dictionary.push(new app.Word(wordList[i]));
        //LoadRareDictionary();
        //makeSafeDictionary();
        app.linkDictionary();
        app.searchDictionary();
        //app.LoadLinks();

        if(!window.localStorage.getItem("dictionary"))
            DictionaryCtrl.createDictionary(); // this create

    }
},

Word: function (word) {
    /*      if (word)
     word = {word:word, links: [], explored: 0, previous: undefined};
     else
     word = {word:"", links: [], explored: 0, previous: undefined};
     Dictionary.push(word);*/
    if (word)
        this.text = word;
    else
        this.text = "";

    this.links = [];

    // for pathfinding
    this.explored = 0;
    this.previous = undefined;

},
LookupWord: function (word) {
    for (var i = 0; i < Dictionary.length; i++)
        if (Dictionary[i].text == word)
            return Dictionary[i];

    return null;
},

OneLetterDifferent: function (wordA, wordB) {
    if (wordA.length != 4 || wordB.length != 4)
        return false;

    var diffChars = 0;
    for (var i = 0; i < wordA.length; i++) {
        if (wordA.charAt(i) != wordB.charAt(i)) {
            diffChars++;
            if (diffChars > 1)
                return false;
        }
    }

    if (diffChars == 1)
        return true;
    else
        return false;
},

// path finding
FindPath: function (startWord, endWord, text) {
    var path = [];

    var startWord = this.LookupWord(startWord);
    var endWord = this.LookupWord(endWord);

    if (startWord == null || endWord == null || startWord == endWord)
        return path;

    var wordList = [];
    wordList.push(startWord);

    for (var i in Dictionary) {
        Dictionary[i].explored = false;
        Dictionary[i].previous = null;
    }

    startWord.explored = true;
    startWord.explored = true;

    while (wordList.length > 0) {
        node = wordList.shift();
        for (var i = 0, l = node.links.length; i < l; i++) {
            if (node.links[i] == endWord) {
                thisWord = node;
                while (thisWord != null) {
                    path.push(text ? thisWord.text : thisWord);
                    thisWord = thisWord.previous;
                }

                path.reverse();
                path.push(text ? endWord.text : endWord);

                return path;
            }
            else if (node.links[i].explored == false) {
                wordList.push(node.links[i]);
                node.links[i].explored = true;
                node.links[i].previous = node;
            }
        }
    }

    return path;
},

getPathLinks: function(word1,word2) {
    var linkArr = this.FindPath(word1,word2);
    return linkArr;
},

 //   LoadLinks:function () {
 //       var request = new XMLHttpRequest();
 //       request.open("GET", "data/links.dat", true);
 //       request.responseType = "arraybuffer";
 //       request.send();
 //       request.onloadend = function (event) {
 //           var arrayBuffer = request.response;
 //           var byteArray = new Int16Array(arrayBuffer);
 //
 //           var index = 0;
 //               for (var i = 0; i < byteArray.byteLength; i++) {
 //                   if (byteArray[i] == -1) {
 //                       index++;
 //                        if (index > Dictionary.length - 1)
 //                           break;
 //                   }
 //                   else
 //                       Dictionary[index].links.push(Dictionary[byteArray[i]])
 //                   }
 //       }
 //},



findIndexInDictionary: function (word) {
    var indexOfWord;
    for (var x in Dictionary) {
        if (word == Dictionary[x].text) {
            return x;
        }
    }
}
};

var DictionaryCtrl = {

    createDictionary: function(){
            for(var x in Dictionary){
                DictionaryWords.push(Dictionary[x].text);
                $('#dictionary-result').append('<li  class="list-group-item">'+ Dictionary[x].text +'</li>');
            };

    }
};

var GameCtrl = {
    difficulty: '',
    usedWords: [], // for checking if the word was submitted

    chooseDifficulty: function (element) {
        $("#game-difficulty").html(element.innerHTML);
        this.difficulty = element.innerHTML;
        this.clearPreviousGame();
        this.playGame();
    },
    clearPreviousGame:function(){
        //clear the html when starting new game
        $("#game-start-word").html("");
        $("#game-end-word").html("");
        $("#guess").html("");
        $('#game-win').html("");
        $('#game-input').html("");
    },

    playGame: function () {
        this.continue();
        $('#guess').click(function () {

        })
        var startWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
        var endWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
        while(!app.FindPath(startWord,endWord)){
            console.log("no pair, trying again");
            startWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
            endWord = Dictionary[parseInt(Math.random() * Dictionary.length)];
        }
        console.log("found pair");
        this.usedWords.push(startWord.text);
        $('#game-start-word').html(startWord.text);
        $('#game-end-word').html(endWord.text);
        $('#game-input').keyup(function (e) {
            if (this.value.length == 4) {
                GameCtrl.submitGuess(this.value, startWord.text, endWord.text);
                this.value = "";
            }
            console.log(this.value);
        })
    },
    continue: function () {
        //show continue button
        $('#continue-button').removeClass("ui-screen-hidden");
    },
    submitGuess: function (word, startWord, endWord) {
        word = word.toLowerCase();
        var links = app.getPathLinks(startWord, endWord);
        if (app.LookupWord(word)) {
            if (app.OneLetterDifferent(this.usedWords[this.usedWords.length - 1], word) && word != this.usedWords[this.usedWords.length - 1]) {
                if(app.OneLetterDifferent(this.usedWords[this.usedWords.length - 1], word)){
                    this.usedWords.push(word);
                    $('#guess').append("<div class='glyphicon glyphicon-link'></div><p id" + word + ">" + word + "</p>");
                    if(app.OneLetterDifferent( links[links.length - 1].text, word)){
                        $('#guess').append("<div class='glyphicon glyphicon-link'></div>");
                        $('#game-win').html('<div id="next-game" class="alert alert-success" role="alert"><b>Well done!</b> Next Game -></div>');
                    }
                } else {
                    alert('not valid');
                }
            }
        }
    }
};
var GameStorage = {

    CurrentGame: {
        difficultySet:function(data){
            window.localStorage.setItem('game-difficulty', data);
        },
        difficultyGet:function(data){
            window.localStorage.getItem(data);
        }
    }
};

