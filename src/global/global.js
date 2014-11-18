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

    var $products = $('.container > .product');
    var buyButton = $(document.createElement('div'));
    $products.each(function (index, elem) {
        $('<input/>', {
            'type': 'button',
            'value': 'Add to basket',
            'class': 'buyButton',
            'click': function () {
                $.getJSON('/Website/Basket/Add', { 'product': $(elem).data('productId'), 'amount': 1 }).done(function () {
                    return WebPage.Basket.updateClient();
                });
                return false;
            }
        }).appendTo($(elem).children('.price'));
    });
});
