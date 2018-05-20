$(document).ready(function() {
    $(document).on("click", "#btnscraper", scrapeArticles);
    $(document).on("click", ".save", savearticle);
    $(document).on("click", ".savenote", savenote);
    $(document).on("click", ".deletesave", deletesaved);
   

    function scrapeArticles() {
        $.ajax({
            method: "GET",
            url: "/scrape",

        }).done(function(data) {
            console.log(data);
            window.location = "/"
        })
    };

function savearticle() {
    var artid = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + artid
    }).done(function(data) {
        window.location = "/"
    })
}

function deletesaved() {
    var artid = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + artid
    }).done(function(data) {
        window.location = "/saved"
    })

}

// Modal opener
    $('.modal').modal();
   
 // Saving a new note
 
 function savenote() {
     var noteid = $(this).attr("data-id");
   console.log("this is text value:" + $("#noteText" + noteid).val());
     if(!$("#noteText" + $(this).attr("data-id")).val()) {
         alert("Please enter a new note");
     }
     else {
         $.ajax ({
        method: "POST",
        url: "/notes/save/" + $(this).attr("data-id"),
        data: {
            text: $("#noteText" + $(this).attr("data-id")).val()
        }

         }).done(function(data) {
             console.log(data);
             $("#noteText" + $(this).attr("data-id")).val("");
             window.location="/saved"
         })


     }

}
       


});