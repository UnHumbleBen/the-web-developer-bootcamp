// Listener for checking on/off To-Dos.
$("ul").on("click", "li", function () {
    $(this).toggleClass("completed");
});

// Listener for removing deleted To-Dos.
$("ul").on("click", "span", function (event) {
    $(this).parent().fadeOut(500, function () {
        $(this).remove();
    });

    // Prevents event bubbling.
    event.stopPropagation();
});

// Listener for adding new To-Dos.
$("input[type='text']").keypress(function (event) {
    if (event.which === 13) {
        // When Enter key is pressed, empties the text bar and append to list.
        var todoStr = $(this).val();
        $("ul").append("<li><span><i class='fas fa-trash'></i></span> " + todoStr + "</li>");
        $(this).val("");
    }
});

$(".fa-plus").click(function () {
    $("input[type='text']").fadeToggle();
});