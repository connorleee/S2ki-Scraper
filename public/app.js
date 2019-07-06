// Waits for page to fully load before runnning any functions
$(() => {

    $("#scraper").click(() => {
        $.get({
            url: "/scrape"
        }).then(
            window.location.reload()
        )
    })

    $(".saveArticle").click(function() {
        let thisId = $(this).attr("data-id")
        
        $.ajax({
            method: "PUT",
            url: "/saved/" + thisId
        })
    })
})
