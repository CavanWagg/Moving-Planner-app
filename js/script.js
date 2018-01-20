
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetString = $('#street').val();
    var cityString = $('#city').val();
    var address = streetString + ', ' + cityString;

    $greeting.text('Oh, I see you want to live at ' + address + '?')

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewURL + '">'); //Why do i need single quotes inside the double quotes?
    //add two single quotes to make double quotes?
    //$body.append -> adds the image to the end of the body
    
 // NYTimes AJAX request
 var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityString + '&sort=newest&api-key=7d88da97aa99493f902d17c0fe8eef8d'
   
    $.getJSON(nytimesUrl, function (data) {
       

        $nytHeaderElem.text('New York Times Articles relevant to ' + cityString);

        articles = data.response.docs; //found by console>network>article search>preview>response>docs
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+ 
                '</a>'+ 
                '<p>' + article.snippet + '</p>' + '</li>');
        };


        

    
}).error(function(e){  //This is called chaining: attaching a method to the end of another. takes in e: the error itself
    //but we don't do anything with e just a text message.
    $nytHeaderElem.text('Sorry, New York Times Articles Could Not Be Loaded');
});

var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text("failed to get wikipedia resources");
}, 8000);
var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityString + '&format=json&callback=wikiCallback';

$.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    //jsonp: "callback"
    success: function ( response ) {
        
        var articleList = response[1]; //how do i check this without knowing what's there? How can I check to see
        //what i need to look for?
         for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;

            $wikiElem.append('<li><a href="' + url + '">' +
                articleStr + '</a></li>');
                
        };

        clearTimeout(wikiRequestTimeout);

    }


    });


    return false;

   
};



$('#form-container').submit(loadData);
