/// <reference path="../definition/jquery.d.ts" />
$(function () {
    //onload
    $('.main-column-left nav > ul > li').click(function (event) {
        return $(event.delegateTarget).toggleClass('show-menu');
    });
});
