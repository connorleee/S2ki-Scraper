// Waits for page to fully load before runnning any functions
$(() => {

    $("#scraper").click(() => {
        $.get({
            url: "/scrape"
        }).then(
            setTimeout(() => {
                window.location.reload()
            }, 5000) 
        )
    })

    $(".saveArticle").click(function() {
        let thisId = $(this).attr("data-id")
        
        $.ajax({
            method: "PUT",
            url: "/saved/" + thisId
        }).then(() =>{
            alert("Article Saved!")
        })
    })
})
