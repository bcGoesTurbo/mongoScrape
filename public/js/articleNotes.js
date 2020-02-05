// public/js/artNotes.js

$("#addNotesBtn").on("click", function(){
    event.preventDefault();
    let urlDest = "/addNote/" + $("#articleId").html();
    $.ajax({
        method: "POST",
        url: urlDest,
        data: {
          title: "",
          body: $("#yourNotes").val()
        }
    })
    .then(function(data) {
        console.log(data);
        $("#yourNotes").empty();
        window.location.href = "/savedArticles";
    });
});
