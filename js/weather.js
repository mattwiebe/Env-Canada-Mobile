jQuery(document).ready(function($){
	$("#spinner").show();
	$.get("/proxy/proxy.php?mode=native&url=http://www.weatheroffice.gc.ca/city/pages/mb-38_metric_e.html", function(data){
		$(data).find("#mainContent").appendTo("body");
		tweaks();
		$("#spinner").hide();
	});
	
	function tweaks() {
		var mainImage = $("#currentimg"),
			mainImageSrc = mainImage.attr("src").replace('weathericons', 'weathericons/large'),
			datetime = $("#cityobserved dd:last");
			currentTime = datetime.text().split(/ [A-Z][DS]T\b/)[0];
			units = $(".temperature sup");
		mainImage.attr("src", mainImageSrc);
		datetime.attr("id", "current-time").show().text(currentTime);
		units.text(units.text());
		$(".dd2, .nodata, .spacer").remove();
		celciusWrapper();
		expander();
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

	
	function expander() {
		var el = $("#cityf"),
			firstItem = el.find(".fperiod:first");
			height = firstItem.height();
			expander = $("<div id='expander'></div>"),
			moreText = '↓ More',
			lessText = '↑ Less';
		
		el.data('originalHeight', el.height() );
		el.data("shortHeight", height);
		
		expander.text(moreText).click(function() {
			var self = $(this),
				currentHeight = el.height(),
				shortHeight = el.data("shortHeight"),
				tallHeight = el.data("originalHeight");
				targetHeight = ( currentHeight == tallHeight ) ? shortHeight : tallHeight;
				text = ( self.text() === moreText ) ? lessText : moreText;
			el.height(targetHeight);
			self.text(text);
		});
		
		el.height(height).after(expander);
	}
	
});