/// <reference path="../definition/jquery.d.ts" />
//home page
//onload
$(function () {
    var $home = $('#home');
    var $homeslides = $('#homeslide a');

    for (var x = 0; x < $homeslides.length; x++) {
        var $slide = $homeslides.eq(x);
        var $img = $('<img src="' + $slide.text() + '" class="slide" />');
        $img.data('link', $slide.attr('href'));
        $home.append($img);
    }
    var $slides = $home.find('img');
    $slides.on('click', function (event) {
        location = $(event.target).data('link');
    });

    var currentIndex = $slides.length - 1;
    var runner = function () {
        $slides.eq(currentIndex).fadeOut(1000);

        currentIndex++;
        if (currentIndex >= $slides.length)
            currentIndex = 0;

        $slides.eq(currentIndex).fadeIn(1000);
    };
    runner();
    setInterval(runner, 5000);

    var $newImages = $('.new');
    $newImages.eq(0).show();

    var newList = ["http://www.coloriwatches.com/webshop/Home-pagina/watch-new1.jpg", "http://www.coloriwatches.com/webshop/Home-pagina/watch-new-2.jpg"];
    var newIndex = 0;
    var maxIndex = 2;
    var newRunner = function () {
        $newImages.eq(newIndex).fadeOut(1000);
        newIndex++;
        if (newIndex >= maxIndex)
            newIndex = 0;

        $newImages.eq(newIndex).fadeIn(1000);
    };
    setInterval(newRunner, 7500);
});
