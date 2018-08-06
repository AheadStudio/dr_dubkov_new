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

			},

		};

	})();

	DR_DUBKOV_NEW.loadScripts.init();

})(jQuery);
