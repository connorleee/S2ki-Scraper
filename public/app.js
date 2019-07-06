// Waits for page to fully load before runnning any functions
$(() => {

    $("#scraper").click(() => {
        $.get({
            url: "/scrape"
        }).then(
            window.location.reload()
        )
    })
})
