
$(() => {
    $("#scraper").click(function () {
        $.get({
            url: "/scrape"
        }).then(location.reload())
    })

})
