(function($){
	var proxyBase = "/proxy/proxy.php?mode=native&url=",
		ecBase = 'http://www.weatheroffice.gc.ca';

	$(document).ready(getWeather);

	function spinner(arg) {
		$("#spinner")[arg]();
	}
	
	function getWeather() {
		spinner("show");
		$.get(proxyBase + "http://www.weatheroffice.gc.ca/city/pages/mb-38_metric_e.html", function(data){
			spinner("hide");
			showRefreshButton();
			$(data).find("#mainContent").appendTo("body");
			maybeWarning(data);
			tweaks();
		});
	}
	
	
	function showRefreshButton() {
		var button = $('<div id="refresh"></div>'),
			target = $("body > h1");
		button.click(function() {
			var t = $(this),
				content = $("#mainContent");
			content.fadeOut().remove();
			getWeather();
			t.remove();
		}).appendTo(target);
	}
	
	function maybeWarning(data) {
		var dataWrap = $(data),
			notice,
			watch = dataWrap.find("#watch"),
			warning = dataWrap.find("#warning"),
			ended = dataWrap.find("#end");
			
		notice = (watch.length) ? watch : (warning.length) ? warning : (ended.length) ? ended : false;
		
		if ( notice ) {
			notice.addClass("box info").insertBefore("#mainContent");
			notice.find("a").click(function(ev) {
				ev.preventDefault();
				var self = $(this),
					url = self.attr("href");
				if ( ! self.hasClass("clicked") ) {
					spinner("show");
					$.get(proxyBase + ecBase + url, function(data){
						var info = $(data).find(".width600");
						info.hide().appendTo(notice).slideDown(300);
						spinner("hide");
					});
				}
				else {
					var showHide = self.parent().next();
					showHide.slideToggle(300);
				}

				self.addClass("clicked");
				
			});
		}
	}
	
	function tweaks() {
		var mainImage = $("#currentimg"),
			mainImageSrc,
			datetime = $("#cityobserved dd:last");
			currentTime = datetime.text().split(/ [A-Z][DS]T\b/)[0];
			units = $(".temperature sup");

		if ( mainImage.length ) {
			mainImageSrc = mainImage.attr("src").replace('weathericons', 'weathericons/large');
			mainImage.attr("src", mainImageSrc);
		}
		else {
			$(".noConditionIcon").attr("id", "currentimg");
		}
		datetime.attr("id", "current-time").show().text(currentTime);
		units.text(units.text());
		$(".dd2, .nodata, .spacer").remove();
		celciusWrapper();
		maybeHumidex();
		maybeWindChill();
		makeExpander();
	}
	
	function maybeHumidex() {
		$("a[href='/mainmenu/faq_e.html#weather4b']").parent().next().addClass("humidex");
	}
	
	function celciusWrapper() {
		var els = $("#cityf").find(".low, .high");
		els.each(function(index) {
			var self = $(this),
				text = self.text();
			replaced = text.replace('°C', '<sup>°C</sup>').replace("\240", "");
			self.html(replaced);
		});
	}
	
	function maybeWindChill() {
		$("a[href='/mainmenu/faq_e.html#weather2']").parent().next().addClass("windchill");
	}
	
	function makeExpander() {
		var el = $("#cityf"),
			firstItem = el.find(".fperiod:first");
			height = firstItem.height();
			expander = $("<div id='expander'></div>"),
			moreText = '↓ More',
			lessText = '↑ Less',
			innerID = 'cityinner';

		el.data("shortHeight", height);
		el.wrapInner('<div id="cityinner"></div>');

		expander.text(moreText).click(function() {
			var self = $(this),
				currentHeight = el.height(),
				shortHeight = el.data("shortHeight"),
				tallHeight = $("#"+innerID).height();
				targetHeight = ( currentHeight == shortHeight ) ? tallHeight : shortHeight;
				text = ( self.text() === moreText ) ? lessText : moreText;

			el.height(targetHeight);
			self.text(text);
		});
		
		el.height(height).after(expander);
	}
})(jQuery);

if ( window.applicationCache ) {
	window.applicationCache.addEventListener('updateready', function(){
		window.applicationCache.swapCache();
	}, false);
}