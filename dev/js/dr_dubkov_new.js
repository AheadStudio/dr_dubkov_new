(function($) {
	var DR_DUBKOV_NEW = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			loadScripts: {

				$pageContent: $(".page-content"),
				$pageHeader: $(".page-header"),

				init: function() {
					var self = this;

					self.preloadPhone();
					self.scrollAnimation.init();
				},

				preloadPhone: function() {
					var self = this;

					$sel.window.on("load", function() {
						setTimeout(function() {
							self.$pageHeader.addClass("active");
							self.$pageContent.addClass("active");
						}, 1000);
					});

				},

				scrollAnimation: {

					blocks: [],

					init: function() {
						var self = this;
						$("[data-animationtype]:not(.animated), [data-animation]:not(.animated)").each(function() {
							var $item = $(this);
							self.blocks.push({
								"html": $item,
								"top": $item.offset().top
							});
							$item.addClass("beforeanimate");
						});

						$sel.window.on("scroll", function() {
							self.check();
						});
						setTimeout(function() {
							self.check();
						}, 50);

					},
					check: function() {
						var self = this,
							block = false,
							blockTop = false,
							top = $sel.window.scrollTop(),
							buffer = parseInt($sel.window.height()) / 1.15;
						for(var i = 0, len = self.blocks.length; i < len; i++) {
							block = self.blocks[i],
							blockTop = parseInt(block.top, 10);
							if(block.html.hasClass("animated")) {
								continue;
							}
							if(top + buffer >= blockTop) {
								block.html.addClass("animated");
							}

						}
					}

				},

			},


			menu: {

				init: function() {
					var self = this;

					self.start();
				},

				start: function() {
					var self = this,
						$menu = $(".header-burger-holder");

					$menu.on("click", function() {
						if ($sel.body.hasClass("open-menu")) {
							self.hide($menu);
						} else {
							self.show($menu);
						}
					});

					$(".close-menu").on("click", function() {
						self.hide($menu);
					})
				},

				show: function($el) {
					$el.addClass("active");
					$sel.body.addClass("open-menu");
				},

				hide: function($el) {
					$el.removeClass("active");
					$sel.body.removeClass("open-menu");
				},

			},


			slider: function() {
				var self = this,
					$slick = $(".slick-slider-list"),
					$itemSlider = $(".slick-slider-item");

				var $prevNumber = $(".slick-slider-number-prev");
				var $nextNumber = $(".slick-slider-number-next");

				$slick.on("init reInit afterChange", function(event, slick, currentSlide, nextSlide){
				    var i = (currentSlide ? currentSlide : 0) + 1;
					$prevNumber.text(i)
					$nextNumber.text(slick.slideCount)
				});

				$slick.slick({
					arrows: true,
					appendArrows: $(".slick-slider-arrow"),
					autoplay: true,
					autoplaySpeed: 1000,
					prevArrow: '<div class="slick-arrow-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93 176"><path d="M2.1 88.5L89.5 1l2.8 2.8L4.9 91.3l-2.8-2.8z"/><path d="M4.9 85.6l87.5 87.5-2.8 2.8L2.1 88.5l2.8-2.9z"/></svg></div>',
					nextArrow: '<div class="slick-arrow-next"><svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93 176"><path d="M92.34 88.46L4.88 175.92l-2.82-2.82 87.46-87.47z" fill="#4a4a4a"/><path d="M89.52 91.28L2.06 3.81 4.88 1l87.46 87.46z" fill="#4a4a4a"/></svg></div>',
					infinite: true,
					speed: 1200,
				});

				$itemSlider.on("mousedown", function() {
					item = $(this);
					item.css("cursor", "-webkit-grab");
				});

				$itemSlider.on("mouseup", function() {
					item = $(this);
					item.css("cursor", "pointer");
				});

			},


			forms: {

				init: function($form) {
					var self = this;

					if (!$form) {
						var $form = $sel.body;
					}

					self.applyJcf($form);
					self.mask($form);
					self.validate.init($(".form", $sel.body));
				},

				mask: function($form) {
					$("[data-number]", $form).each(function() {
						var $item = $(this);
						$item.mask($item.data("number"));
					});
				},

				applyJcf: function($form) {
					var $selects = $("select", $form),
						$numbers = $("input[type=number]", $form),
						$checkbox = $("input[type=checkbox]", $form),
						$radio = $("input[type=radio]", $form),
						$range = $("input[type=range]", $form);

					$checkbox.each(function() {
						var $item = $(this);
						if ($item.data("jcfapply") !== "off") {
							jcf.replace($item);
						}
					});

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: true,
						multipleCompactStyle: true,
					});

					jcf.setOptions("Number", {
						pressInterval: "150",
						disabledClass: "jcf-disabled",
					});

					jcf.setOptions("Range", {
						orientation: "horizontal",
					});

					$selects.each(function() {
						var $select = $(this),
							selectPlaceholder = $select.attr("placeholder");

						if ($select.data("jcfapply") !== "off") {
							jcf.replace($select);
						}

					});

					$numbers.each(function() {
						var $number = $(this);
						jcf.replace($number);
					});


					$radio.each(function() {
						var $item = $(this);
						jcf.replace($item);
					});

					$range.each(function() {
						var $item = $(this);
						jcf.replace($item);
					});

				},

				validate: {

					init: function($form) {
						var self = this;

						$form.each(function() {
							(function($form) {
								var $formFields = $form.find("[data-error]"),
									formParams = {
										rules: {
										},
										messages: {
										}
									};

								$.validator.addMethod("mobileRU", function(phone_number, element) {
									phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
									return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
								}, "Error");

								$formFields.each(function() {
									var $field = $(this),
										fieldPattern = $field.data("pattern"),
										fieldError = $field.data("error");
									if(fieldError) {
										formParams.messages[$field.attr("name")] = $field.data("error");
									} else {
										formParams.messages[$field.attr("name")] = "Ошибка заполнения";
									}
									if(fieldPattern) {
										formParams.rules[$field.attr("name")] = {};
										formParams.rules[$field.attr("name")][fieldPattern] = true;
									}
								});

								if($form.data("success")) {
									formParams.submitHandler = function(form) {
										$.magnificPopup.close();
										event.preventDefault();
										setTimeout(function() {
											$.magnificPopup.open({
												items: {
													src: $form.data("success"),
													type: "ajax",
												},
												tLoading: "Загрузка...",
												closeMarkup: '<button title="%title%" type="button" class="mfp-close btn-container-close"><svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111 111"><path d="M5.86 3.66l101.57 101.57-2.82 2.82L3 6.49z"/><path d="M3 105.23L104.6 3.66l2.82 2.82L5.86 108.05z"/></svg></button>',
												mainClass: "mfp-fade",
												removalDelay: 300,
												closeOnBgClick: false,
												closeBtnInside: true,
												callbacks: {
													open: function() {
														$(".btn-container-close").on("click", function() {
															$.magnificPopup.close();
														});
													},
													ajaxContentAdded: function() {
														DR_DUBKOV_NEW.reload();
														$(".btn-container-close").on("click", function() {
															$.magnificPopup.close();
														});
													},
													parseAjax: function(mfpResponse) {
														mfpResponse.data = $(mfpResponse.data).find("#form-result");
													}
												}

											});
										}, 300)

									};
								}
								$form.validate(formParams);

							})($(this))
						});

					},

				},

			},




			popup: {

				init: function() {
					var self = this;
					//self.fancyBox();
					self.mfp.init();
				},

				fancyBox: function() {
					var $popupItems = $('[data-fancybox="certificate"]');

					$popupItems.fancybox({
						arrows : true,
						keyboard : true,
						buttons : [
							'close'
						],
						defaultType : 'image',
						hideScrollbar: false,
						animationEffect: "zoom-in-out",
					});

				},

				mfp: {
					init: function() {
						var $popup = $(".mfp-modal");

						$popup.each(function() {
							var el = $(this),
								elType = el.data("mfpType"),
								elAjaxContent = el.data("mfpAjaxcontent");

							if (elAjaxContent) {
								parseAjax = function(mfpResponse) {
									mfpResponse.data = $(mfpResponse.data).find(elAjaxContent);
								}
							} else {
								parseAjax = null;
							}

							el.magnificPopup({
								type: elType ? elType : "inline",
								tLoading: "Загрузка...",
								closeMarkup: '<button title="%title%" type="button" class="mfp-close btn-container-close"><svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111 111"><path d="M5.86 3.66l101.57 101.57-2.82 2.82L3 6.49z"/><path d="M3 105.23L104.6 3.66l2.82 2.82L5.86 108.05z"/></svg></button>',
								mainClass: "mfp-fade",
								removalDelay: 300,
								closeOnBgClick: false,
								closeBtnInside: true,
								callbacks: {
									open: function() {
										$(".btn-container-close").on("click", function() {
											$.magnificPopup.close();
										});
									},
									ajaxContentAdded: function() {
										DR_DUBKOV_NEW.reload();
										$(".btn-container-close").on("click", function() {
											$.magnificPopup.close();
										});
									},
									parseAjax: parseAjax,
								}
							});
						})
					}
				},

			},


			map: {
				init: function() {

					$("#map", $sel.body).each(function() {
						var $map = $(this),
							lng = parseFloat($map.data("lng"), 10) || 0,
							lat = parseFloat($map.data("lat"), 10) || 0,
							zoom = parseInt($map.data("zoom"));
						var options = {
							center: new google.maps.LatLng(lat, lng),
							zoom: zoom,
							mapTypeControl: false,
							panControl: false,
							zoomControl: true,
							zoomControlOptions: {
								style: google.maps.ZoomControlStyle.LARGE,
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							scaleControl: true,
							streetViewControl: true,
							streetViewControlOptions: {
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							styles: [
								{"featureType": "landscape", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "poi", "stylers": [
									{"saturation": -300},
									{"lightness": -10},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.highway", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.arterial", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "road.local", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "transit", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "administrative.province", "stylers": [
									{"visibility": "off"}
								]},
								{"featureType": "water", "elementType": "labels", "stylers": [
									{"visibility": "on"},
									{"lightness": -25},
									{"saturation": -100}
								]},
								{"featureType": "water", "elementType": "geometry", "stylers": [
									{"hue": "#ffff00"},
									{"lightness": -25},
									{"saturation": -97}
								]}
							]
						};

						var api = new google.maps.Map($map[0], options);
						var point = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: api,
							icon: $map.data("icon")
						});

					});
				}
			},



			miniScripts: {
				init: function() {
					var self = this;

					//self.playYouTube();
				},

				playYouTube: function() {
					var player;
					function onYouTubePlayerAPIReady() {
					    player = new YT.Player("video-home", {
					        events: {
					            'onReady': onPlayerReady,
					        }
					    });
					}
					function onPlayerReady(event) {
						console.log(123);
					    event.target.playVideo();
					}

					onYouTubePlayerAPIReady();
				}
			}

		};

	})();

	DR_DUBKOV_NEW.slider();
	DR_DUBKOV_NEW.map.init();
	DR_DUBKOV_NEW.loadScripts.init();
	DR_DUBKOV_NEW.popup.init();
	DR_DUBKOV_NEW.menu.init();
	DR_DUBKOV_NEW.forms.init();
	DR_DUBKOV_NEW.miniScripts.init();


	DR_DUBKOV_NEW.reload = function() {
		DR_DUBKOV_NEW.popup.init();
		DR_DUBKOV_NEW.forms.init();

	};
})(jQuery);
