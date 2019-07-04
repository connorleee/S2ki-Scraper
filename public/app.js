
$(() => {
    $("#scraper").click(function () {
        $.get({
            url: "/scrape"
        }).then(
            $.get({url: "/"})
        )
    })

})
