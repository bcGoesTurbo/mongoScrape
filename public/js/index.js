// public/js/index.js

function createCard (rec){
    const baseUrl = "https://www.foxsports.com.au/";
    var card   = $("<div>");
    var header = $("<h5>");
    var body   = $("<div>");
    var sumry  = $("<p>");
    var ahref  = $("<p>");
    header.addClass("card-header");
    header.html(
        "<a href=" +
        baseUrl    +
        rec.link   +
        " class='pattern-5-article__heading-text' target='_blank'>" +
        rec.title  +
        "</a>"
    );
    body.addClass("card-body");
    body.html('<p class="card-text">' +
              rec.summary +
              "</p>" +
              "<a href='/saveArticle/" + 
              rec._id + "' " +
              "class='badge badge-pill badge-warning' " +
              "data-id='" + 
              rec._id +
              "'>Save Article</a>" 
              );
    card.addClass ("card my-4 border-info");
    card.append(header);
    card.append(body);
    return card;          
};

$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append( createCard(data[i]) );
    }
});

$("#topBtn").on("click", function(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

$(".card").on("click", ".badge-warning", function(){
    console.log("clic en boton save article");
});
