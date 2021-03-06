/// <reference path="../definition/jquery.d.ts" />
module WebPage {
	export module References {
		export module MessageBox {
			export var $messageLayer: JQuery;
			export var $message: JQuery;

			export var $messageHeader: JQuery;
			export var $messageBody: JQuery;
		}

		export var $document: JQuery;
		export var $html: JQuery;
		export var $body: JQuery;
	}

	export module Data {
		export var language: string;
		export var country: string;
		export var productGuid: string;
		export var basketGuid: string;
	}



	export class Event {
		public eventType: EventType;
		public data: any;
		constructor(eventType: EventType, data: any) {
			this.eventType = eventType;
			this.data = data;
		}
	}

	export enum EventType {
		BeforeLoad,
		Load
	}
	export module Events {
		export module Handlers {
			export var onBeforeLoad: Function[] = [];
			export var onLoad: Function[] = [];
		}


		export function fire(eventType: EventType, data: any = null) {

			var handlers = getHandlers(eventType);
			for (var x = 0; x < handlers.length; x++) {
				handlers[x].call(new Event(eventType, data));
			}
		}

		function getHandlers(eventType: EventType): Function[] {
			switch (eventType) {
				case EventType.Load:
					return Handlers.onLoad;
				case EventType.BeforeLoad:
					return Handlers.onBeforeLoad;
			}
			return null;
		}

		export function on(eventType: EventType, handler: Function) {
			getHandlers(eventType).push(handler);
		}
	}


	//wil be overridden
	export function xresourceString(name: string): string {
		return 'no translation: ' + name;
	}
	//init the page (onload)
	export function load(): void {

		Events.fire(EventType.BeforeLoad);

		References.$document = $(document);
		References.$html = $('html');
		References.$body = $(document.body);

		//set language
		Data.language = References.$html.attr('lang');
		Data.country = <any>References.$html.data('country');

		//init basket
		Basket.init();

		//verplichte velden
		$('.required').change((event) => {
			var $this = $(event.target);

			if ($this.val().length) {
				$this.addClass('ok');
			} else {
				$this.removeClass('ok');
			}

		});

		Events.fire(EventType.Load);
	}

	export module Basket {
		export module References {
			export var $basket: JQuery;
			export var $amount: JQuery;
			export var $total: JQuery;
		}

		export module Events {
			export var onChange: Function;
		}

		export function init(): void {
            References.$basket = $('#shoppingCart');
		    References.$basket.on('click', () =>
		    {
		        location.href = '/website/pages/basket';
		    });
			References.$amount = $('#shoppingcart_amount');
			References.$total = $('#shoppingcart_total');

			updateClient(true);
		}

		export function updateClient(init: boolean = false) {
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: '/Website/Basket/Update-client',
				cache: false
			})
				.done(data => {

					if (Events.onChange) {
						var result = Events.onChange.call(this, data);
						if (result === false)
							return;
					}

					References.$total.text(data.total);
					References.$amount.text(data.count);

					if (!init) {
						$('.basket-total').text(data.total);
						$('.basket-total-incl').text(data.totalIncl);
						$('.basket-total-excl').text(data.totalExcl);
					}
				});
		}

		export function updateAmount(id: string, amount: number, callBack: Function = null) {
			var data = {};
			data["property"] = 'amount';
			data["id"] = id;
			data["amount"] = amount;

			$.ajax({
				type: 'POST',
				data: data,
				dataType: 'json',
				url: '/Website/Basket/Update',
				cache: false
			}).done((result) => {

					if (callBack != null) {
						callBack.call(this, result);
					}

					updateClient();
				});
		}

		export function remove(id: string) {
			var data = {};
			data["property"] = 'remove';
			data["id"] = id;

			$.ajax({
				type: 'POST',
				data: data,
				dataType: 'text',
				url: '/Website/Basket/Update',
				cache: false
			}).done(() => updateClient());
		}
	}

	export module Message {
		export enum MessageType {
			Information,
			Warning,
			Success,
			Error
		}

		export class Settings {
			public body: string;
			public header: string;
			public type: MessageType = MessageType.Information;

		}

		export function show(messagesettings: Settings, callbackFunction: Function = null) {

			if (!References.MessageBox.$messageLayer) {
				References.MessageBox.$messageLayer = $('<div id="message-container"><div class="message">' +
					'<div class="message-header"></div>' +
					'<div class="message-body"></div>' +
					'</div></div>');

				References.MessageBox.$messageLayer.appendTo(References.$body);
				References.MessageBox.$message = References.MessageBox.$messageLayer.find('.message');
				References.MessageBox.$messageHeader = References.MessageBox.$message.find('.message-header');
				References.MessageBox.$messageBody = References.MessageBox.$message.find('.message-body');

				References.MessageBox.$messageLayer.bind('click', () => {
					References.MessageBox.$message.animate({ 'top': '150%' }, 200, function () {

						References.MessageBox.$messageLayer.fadeOut(200);

						if (callbackFunction != null) {
							callbackFunction.call(this);
						}

					});

				});
			}

			References.MessageBox.$messageLayer.focus();
			setTimeout(() => {
				References.MessageBox.$messageLayer.trigger('click');
			}, 2500);


			References.MessageBox.$messageHeader.text(messagesettings.header);
			References.MessageBox.$messageBody.text(messagesettings.body);
			References.MessageBox.$message.removeClass();
			switch (messagesettings.type) {
				case MessageType.Error:
					References.MessageBox.$message.addClass('message error');
					break;
				case MessageType.Success:
					References.MessageBox.$message.addClass('message success');
					break;
				case MessageType.Warning:
					References.MessageBox.$message.addClass('message erwarningror');
					break;
				default:
					References.MessageBox.$message.addClass('message info');
					break;
			}

			References.MessageBox.$messageLayer.fadeIn(200);
			var $window = $(window);
			var top = Math.abs((($window.height() - References.MessageBox.$message.outerHeight()) / 2));
			//top = $window.scrollTop();
			References.MessageBox.$message.css('top', 0).animate({ 'top': top }, 200);
		}
	}
}

//Load website
$(() => WebPage.load());


$(() => {

    //onload
	/*var firstload;
	var firstvisit = getCookie('firstvisit');
	if (firstvisit == '' || firstvisit == 'true') {
		document.cookie = "firstvisit=true";
		var $body = $('body');
		$body.append('<div id="ad"><div id="darkFill" class="popup"></div><div id="popupAd"><a id="popClose">Close</a><img src="//colori.azurewebsites.net/resources/ad.jpg" /></div></div>');
		var $dark = $('#darkFill');
		var $ad = $('#popupAd');

		$ad.delay(1500).fadeIn('slow');
		$dark.delay(1500).fadeIn('slow', () => {
			if ($('#popupAd').is(':hidden')) {
				$ad.hide();
				$dark.hide();
			}
		});

		$('#popupAd').click((event) => {
			document.cookie = "firstvisit=false";
			$dark.fadeOut('slow');
			$ad.fadeOut('slow');
		});
	} else {
		document.cookie = "firstvisit=false";
	}*/

	var $menuItems = $('.main-column-left nav>ul>li>span');
	var index = getCookie('indexmenu');
	if (index != '') {
		var parsedindex = parseInt(index);
		$menuItems.eq(parsedindex).parent().addClass('show-menu');
	} else {
		$menuItems.eq(0).parent().addClass('show-menu')
	}
	$menuItems.click((event) => {
		var c = $(event.delegateTarget).parent(); 
		c.toggleClass('show-menu');
		if (c.hasClass('show-menu')) {
			document.cookie = "indexmenu=" + c.index();
		}
		else if (!$('.menucontent > nav > ul > li').hasClass('show-menu')) {
			document.cookie = "indexmenu=0";
		} else {
			// Do nothing
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

    var $imageFrame = $('.product-left .product-image .imageFrame');
    var $zoomImage = $($imageFrame).children('img');

    (<any>$zoomImage).elevateZoom({
        zoomType: "lens",
        lensShape: "round",
        lensSize: 400
    });
    //var link = $zoomImage.data('guid');
    //$imageFrame.addClass('easyzoom');
    //$zoomImage.detach();
    //$imageFrame.append('<a href="' + '/image/product/guid/' + link + '?width=750&height=750"></div>');
    //$imageFrame.children('a').append($zoomImage);



    //$easyzoom = $('.easyzoom').easyZoom();

	var $products = $('.product .price span');
	for (var x = 0; x < $products.length; x++) {
		var $product = $products.eq(x);
		var price = $product.text();
		var decimals = price.substring(price.length - 2, price.length);		
		if (decimals == '00') {
			price = price.substring(0, price.length - 3);
			$product.text(price + ",-");
		}
	}
	var $products = $('.product .originalPrice span');

	for (var x = 0; x < $products.length; x++) {
		var $product = $products.eq(x);
		var price = $product.text();
		var decimals = price.substring(price.length - 2, price.length);		
		if (decimals == '00') {
			price = price.substring(0, price.length - 3);
			$product.text(price + ",-");
		}
	}

	if (WebPage.Data.productGuid) {
		$('#submit').click((event) => {
			event.preventDefault();
			var data = {
				basketId: WebPage.Data.basketGuid,
				product: WebPage.Data.productGuid,
				remark: $('#remark').val(),
				amount: 1
			};

			var $extension = $('.extension');
			if ($extension.length > 0) {
				var $set = null;
				for (var x = 0; x < $extension.length; x++) {
					var $element = $extension.eq(x);
					if ($element.attr('id') != 'remark') {
						if ($element.hasClass('inputrequired')) {
							if ($element.val().length == 0) {
								if (!$set) {
									$set = $element;
								}
								$element.addClass('missing');
							} else {
								$element.removeClass('missing');
							}
						}

						data["extension:" + $element.attr('id')] = $element.val();
					}
				}
			}
			if ($set) {
				//not complete, abort
				var msg = new WebPage.Message.Settings();
				msg.type = WebPage.Message.MessageType.Error;
				msg.body = WebPage.resourceString('BasketNotAllRequiredFieldsFilled');
				msg.header = WebPage.resourceString('Basket');
				WebPage.Message.show(msg, () => {
					$set.focus();
				});

				return;
			}

			$.ajax({
				type: 'POST',
				url: '/Website/Basket/Add',
				cache: false,
				data: data
			})
				.done(() => {
					WebPage.Basket.updateClient();
					location.href = "/Website/Pages/Basket";
				})
				.fail(() => {
					msg = new WebPage.Message.Settings();
					msg.type = WebPage.Message.MessageType.Error;
					msg.body = WebPage.resourceString('BasketAddError');
					msg.header = WebPage.resourceString('Basket');

					WebPage.Message.show(msg);
				})
				.always(() => { });
		});
	};
	
	$('.intro.item .description').hide();
	var $detail = $('.product-left .product-detail');
	$($detail).children('.description').hide();
	var $innercontent = $($detail).children('.info').children('.details').first().html();
	$($detail).children('.info').html($innercontent).css('marginBottom', '25px');
});

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	}
	return "";
} 