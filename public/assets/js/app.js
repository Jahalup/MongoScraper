$(document).ready(function() {

// Click Events 
    $(document).on("click", "#btnscraper", scrapeArticles);
    $(document).on("click", ".save", savearticle);
    $(document).on("click", ".delete", deletearticle);
    $(document).on("click", ".savenote", savenote);
    $(document).on("click", ".deletesave", deletesaved);
    $(document).on("click", ".notedelete", deletenote);
    $(document).on("click", "#clearart", clearart);

    
    // var elem= document.querySelector('.modal');
    // var instance = M.Modal.getInstance(elem);


// Ajax call to scrape articles
    function scrapeArticles() {
        $.ajax({
            method: "GET",
            url: "/scrape",

        }).done(function(data) {
            console.log(data);
            window.location = "/"
        })
    };

// Ajax call to save article
function savearticle() {
    var artid = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + artid
    }).done(function(data) {
        window.location = "/"
    })
}

function deletearticle() {
    var artid = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + artid
    }).done(function(data) {
        window.location = "/"
    })
}

// Ajax call to 'unsave' and article
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
   

// Ajax call to save a new note

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
     };
};


// Ajax call to delete a note
    function deletenote() {
        var noteid = $(this).attr("data-note-id");
        var artid = $(this).attr("data-article-id");
         $.ajax ({
        method: "DELETE",
        url: "/notes/delete/" + noteid + "/" + artid

        }).done(function(data) {
            console.log("this is returned data: " + data);
            // instance.close();
            window.location="/saved"
         })
    };
     


    function clearart() {
        $.ajax ({
            method: "DELETE",
            url: "/deleteall"
        }).done(function(data) {
            window.location="/"
        })
    }
});