// Checks off To-Dos clicked.
$("li").on("click", function () {
    $(this).toggleClass("completed");
});

// Deletes To-Do when X ix clicked.
$("span").on("click", function (event) {
    $(this).parent().fadeOut(500, function () {
        $(this).remove();
    });

    // Prevents event bubbling.
    event.stopPropagation();
})