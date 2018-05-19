$(document).ready(function() {
    $(document).on("click", "#btnscraper", scrapeArticles);
    $(document).on("click", ".save", savearticle);

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





});