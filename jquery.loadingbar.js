/* ===========================================================
 * jquery-loadingbar.js v1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Add a Youtube-like loading bar  
 * to all your AJAX links 
 *
 * https://github.com/peachananr/loading-bar
 *
 * ========================================================== */

!function($){
  
  var defaults = {
		replaceURL: false,
		target: "#loadingbar-frame",
		direction: "right",
		
		/* Deafult Ajax Parameters  */
		async: true,
		complete: function(xhr, text) {},
		cache: true,
		error: function(xhr, text, e) {},
		global: true,
		headers: {},
		statusCode: {},
		success: function(data, text, xhr) {},
		dataType: "html"
	};
	
	$.fx.step.textShadowBlur = function(fx) {
    $(fx.elem).prop('textShadowBlur', fx.now).css({textShadow: '0 0 ' + Math.floor(fx.now) + 'px black'});
  };
  
	
  $.fn.loadingbar = function(options){
    var settings = $.extend({}, defaults, options);
      
    return this.each(function(index, element){
      var el = $(element),
        href = el.attr("href"),
        target = (el.data("target")) ? el.data("target") : settings.target,
        type = (el.data("type")) ? el.data("type") : settings.type,
        datatype = (el.data("datatype")) ? el.data("datatype") : settings.dataType;

      el.click(function (){
        $.ajax({
          xhr: function() {
            var xhr = jQuery.ajaxSettings.xhr();

            if ("onprogress" in xhr && xhr instanceof window.XMLHttpRequest) {
              xhr.addEventListener('progress', this.progress, false);
              if (xhr.upload) {
                xhr.upload.addEventListener('progress', this.progress, false);
              }
            }
            return xhr;
          },
          type: type,
          url: href,
          async: settings.async,
          complete: settings.complete,
          cache: settings.cache,
          error: settings.error,
          global: settings.global,
          headers: settings.headers,
          statusCode: settings.statusCode,
          success: settings.success,
          dataType : datatype,
          beforeSend: function(jxhr, options) {
            if ($("#loadingbar").length === 0) {
              $("body").append("<div id='loadingbar'></div>");
              $("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));
              
              if(options.dataTypes[0] == 'script') {
                // only "fake it" if using jsonp
                switch (settings.direction) { 
                  case 'right':
                     $("#loadingbar").width((50 + Math.random() * 30) + "%");
                    break;
                  case 'left':
                     $("#loadingbar").addClass("left").animate({
                       right: 0,
                       left: 100 - (50 + Math.random() * 30) + "%"
                     }, 200);
                    break;
                  case 'down':
                     $("#loadingbar").addClass("down").animate({
                       left: 0,
                       height: (50 + Math.random() * 30) + "%"
                     }, 200);
                    break;
                  case 'up':
                     $("#loadingbar").addClass("up").animate({
                       left: 0,
                       top: 100 - (50 + Math.random() * 30) + "%"
                     }, 200);
                    break;
                }
              }
            }
          },
          progress: function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = Math.round(evt.loaded / evt.total * 100);

              switch (settings.direction) {
                case 'right':
                  $("#loadingbar").width(percentComplete + "%");
                  break;
                case 'left':
                  $("#loadingbar").addClass("left").animate({
                    right: 0,
                    left: (100 - percentComplete) + "%"
                  }, 200);
                  break;
                case 'down':
                  $("#loadingbar").addClass("down").animate({
                    left: 0,
                    height: percentComplete + "%"
                  }, 200);
                  break;
                case 'up':
                  $("#loadingbar").addClass("up").animate({
                    left: 0,
                    top: (100 - percentComplete) + "%"
                  }, 200);
                  break;
              }
            }
          }
        }).always(function() {
          switch (settings.direction) { 
            case 'right':
               $("#loadingbar").width("101%").delay(200).fadeOut(400, function() {
                   $(this).remove();
               });
              break;
            case 'left':
               $("#loadingbar").css("left","0").delay(200).fadeOut(400, function() {
                    $(this).remove();
                });
              break;
            case 'down':
                $("#loadingbar").height("101%").delay(200).fadeOut(400, function() {
                     $(this).remove();
                 });
               break;
            case 'up':
                $("#loadingbar").css("top", "0").delay(200).fadeOut(400, function() {
                     $(this).remove();
                 });
               break;
          }
          
        }).done(function(data) {
          if ( history.replaceState && settings.replaceURL == true ) history.pushState( {}, document.title, href );
          if (settings.done) {
            settings.done(data, target)
          } else {
            $(target).html(data)
          }
          
        });
        return false
      });
      
      
    });
  }
  
}(window.jQuery);


