/// <reference path="../definition/jquery.d.ts" />
$(function () {
    //onload
    var $menuItems = $('.main-column-left nav > ul > li');
    $menuItems.click(function (event) {
        return $(event.delegateTarget).toggleClass('show-menu');
    });
    $menuItems.each(function (index, elem) {
        if ($(elem).find('.hybridsaas-menu-current').length != 0) {
            $(elem).addClass('show-menu');
        }
    });
});
