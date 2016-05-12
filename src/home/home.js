/// <reference path="../definition/jquery.d.ts" />
//home page
//onload
$(function () {
    var $home = $('#home');
    $home.append('<div class="left"></div><div class="right"></div>');
    var $homeslides = $('#homeslide a');
    for (var x = 0; x < $homeslides.length; x++) {
        var $slide = $homeslides.eq(x);
        var $img = $('<img src="' + $slide.text() + '" class="slide" />');
        $img.data('link', $slide.attr('href'));
        $home.append($img);
    }
    var $slides = $home.find('img');
    $slides.on('click', function (event) {
        location.href = $(event.target).data('link');
    });
    var currentIndex = $slides.length - 1;
    var negative = false;
    var navi = false;
    var runner = function () {
        if (!navi)
            $slides.eq(currentIndex).fadeOut(1000);
        navi = false;
        if (!negative) {
            currentIndex++;
            if (currentIndex >= $slides.length)
                currentIndex = 0;
        }
        else {
            negative = false;
            currentIndex--;
            if (currentIndex < 0)
                currentIndex = $slides.length - 1;
        }
        $slides.eq(currentIndex).fadeIn(1000);
    };
    runner();
    var interval = setInterval(runner, 5000);
    $home.find('.right')
        .on('click', function () {
        navi = true;
        clearInterval(interval);
        $slides.stop();
        $slides.eq(currentIndex).fadeOut(500);
        runner();
        interval = setInterval(runner, 5000);
    });
    $home.find('.left')
        .on('click', function () {
        navi = true;
        clearInterval(interval);
        $slides.stop();
        $slides.eq(currentIndex).fadeOut(500);
        negative = true;
        runner();
        interval = setInterval(runner, 5000);
    });
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
