// Checks off To-Dos when X is clicked.
$("li").on("click", function () {
    $(this).toggleClass("completed");
});