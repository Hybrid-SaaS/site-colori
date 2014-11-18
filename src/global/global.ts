/// <reference path="../definition/jquery.d.ts" />
declare var WebPage: any;

$(() => {

    //onload
    var $menuItems = $('.main-column-left nav > ul > li');
    $menuItems.click((event) => $(event.delegateTarget).toggleClass('show-menu'));
    $menuItems.each((index, elem) => {
        if ($(elem).find('.hybridsaas-menu-current').length != 0) {
            $(elem).addClass('show-menu');
        }
    });

    var $products = $('.container > .product');
    var buyButton = $(document.createElement('div'));
    $products.each((index, elem) => {
        $('<input/>', {
            'type': 'button',
            'value': 'Add to basket',
            'class': 'buyButton',
            'click': function () {
                $.getJSON('/Website/Basket/Add', { 'product': $(elem).data('productId'), 'amount': 1 }).done(() => WebPage.Basket.updateClient());
                return false;
            }
        }).appendTo($(elem).children('.price'));
    });
});