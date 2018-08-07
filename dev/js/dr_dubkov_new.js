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

	DR_DUBKOV_NEW.loadScripts.init();
	DR_DUBKOV_NEW.menu.init();
	DR_DUBKOV_NEW.miniScripts.init();


})(jQuery);
