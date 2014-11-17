/// <reference path="../definition/jquery.d.ts" />

$(() => {

    //onload
    var $menuItems = $('.main-column-left nav > ul > li');
    $menuItems.click((event) => $(event.delegateTarget).toggleClass('show-menu'));
    $menuItems.each((index, elem) => {
        if ($(elem).find('.hybridsaas-menu-current').length != 0) {
            $(elem).addClass('show-menu');
        }
    });
});