/// <reference path="../definition/jquery.d.ts" />

$(function () {
    //small to big
    var $smallImages = $('.smallimage');
    var $smallImagesFrames = $('.product-image-rest .imageFrame');

    $smallImages.click(function (event) {
        $smallImagesFrames.removeClass('active');

        var $imagebig = $('#imagebig');
        var $target = $(event.target);
        var url = '/image/product/guid/' + encodeURIComponent($imagebig.data('guid')) + '/' + $target.data('index') + '?height=280&width=400';

        $target.parent().addClass('active');

        $imagebig.attr('src', url).hide().fadeIn(250);
    });

    if (!WebPage.Data.productGuid)
        return;

    //retreive related products
    $.getJSON('/data/product/guid/' + encodeURIComponent(WebPage.Data.productGuid) + '/related-products').done(function (data) {
        //has related
        if (data.related) {
            //append to options boxs
            var $related = $('<div class="related-container"></div>');
            $('.product-detail').append($related);

            var handler = function (products, title) {
                if (typeof products != 'undefined') {
                    var $color = $('<div class="related color"><div class="imageFrame"><div class="label">' + title + '</div><div class="images"></div></div></div>');

                    $color.on('click', function (event) {
                        event.stopPropagation();

                        //andere dicht
                        $('.related').removeClass('open');

                        $color.addClass('open');

                        WebPage.References.$body.one('click', function () {
                            $color.removeClass('open');
                        });
                    });

                    var $container = $color.find('.images');

                    if (title != 'Size') {
                        for (var x = 0; x < products.length; x++) {
                            var product = products[x];
                            var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=135&height=94" />');
                            $img.attr({ 'title': product.productcode + '\n' + product.description });
                            $img.data('url', product.url);
                            $container.append($img);
                        }

                        $container.find('img').on('click', function (event) {
                            var $this = $(event.target);
                            if ($this.closest('.related.open').length) {
                                location.href = $this.data('url');
                            }
                        });
                    } else {
                        // Create product dictionary and remove duplicates
                        var productDict = {};
                        for (var x = 0; x < products.length; x++) {
                            if (typeof productDict[products[x]['dimensions']] == 'undefined') {
                                productDict[products[x]['dimensions']] = products[x];
                            }
                        }

                        // Empty products object
                        products = [];

                        for (var key in productDict) {
                            products.push(productDict[key]);
                        }

                        products.sort(function (a, b) {
                            var x = a['dimensions'];
                            var y = b['dimensions'];

                            if (typeof x == "string") {
                                x = x.toLowerCase();
                                y = y.toLowerCase();
                            }

                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        });
                        for (var x = 0; x < products.length; x++) {
                            var product = products[x];
                            var $sizes = $('<div class="size">' + product.dimensions + '</div>');
                            $sizes.data('url', product.url);
                            $container.append($sizes);
                        }

                        $container.find('div.size').on('click', function (event) {
                            var $this = $(event.target);
                            if ($this.closest('.related.open').length) {
                                location.href = $this.data('url');
                            }
                        });
                    }

                    $related.append($color);
                }
            };

            handler(data.related["Size"], 'Size');
            handler(data.related["Color"], 'Color');
        }
    });

    var $bigImage = $('<div class="big-image"></div>');

    $('.product-right').prepend($bigImage);
    //$('.product-right .input-item:first').html('<b>Do you have any comments?</b>');
    //$('.product-right #submit').html('Add to basket');
});
