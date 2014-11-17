/// <reference path="../definition/jquery.d.ts" />

$(() => {

    //onload
    $('.main-column-left nav > ul > li').click((event) => $(event.delegateTarget).toggleClass('show-menu'));
});