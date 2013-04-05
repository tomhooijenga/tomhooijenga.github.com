$(function () {
    "use strict";
    var $body = $("body"),
        $menu = $(".menu");

    var onMenu = false;

    $(window).on("mousemove", function (e) {
        // near edge 
        if (e.clientX < 50) {
            $body.addClass("menu-open");
            onMenu = true;
        } else {
            if (!onMenu) {
                $body.removeClass("menu-open");
            }
        }
    });

    // stay open when leaving edge 
    $menu.on("mouseenter", function () {
        onMenu = true;
    }).on("mouseleave", function () {
        onMenu = false;
    });
})