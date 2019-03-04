(function() {
  var reset_scroll;
  
  reset_scroll = function() {
    var scroller;
    scroller = $("body,html");
    scroller.stop(true);
    if ($(window).scrollTop() !== 0) {
      scroller.animate({
        scrollTop: 0
      }, "fast");
    }
    return scroller;
  };

  window.scroll_it = function() {
    var max;
    max = $(document).height() - $(window).height();
    return reset_scroll().animate({
      scrollTop: max
    }, max * 3).delay(100).animate({
      scrollTop: 0
    }, max * 3);
  };

  window.scroll_it_wobble = function() {
    var max, third;
    max = $(document).height() - $(window).height();
    third = Math.floor(max / 3);
    return reset_scroll().animate({
      scrollTop: third * 2
    }, max * 3).delay(100).animate({
      scrollTop: third
    }, max * 3).delay(100).animate({
      scrollTop: max
    }, max * 3).delay(100).animate({
      scrollTop: 0
    }, max * 3);
  };

  $(window).on("resize", (function(_this) {
    return function(e) {
      return $(document.body).trigger("sticky_kit:recalc");
    };
  })(this));

}).call(this);

// make it stick
$(document).ready(function() {

function make_sticky() {
  $('#sidebar > .inner').after('<div class="sticky-content-spacer"/>');
  $('#sidebar > .inner').stick_in_parent({parent: '.wrapper', spacer: '.sticky-content-spacer'});
}
    if (($( window ).width() < 550) || ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1))){
      $('#sidebar > .inner').trigger("sticky_kit:detach");
    } else {
      make_sticky();
    }
    $( window ).resize(function() {
      if (($( window ).width() < 550) || ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1))){
        $('#sidebar > .inner').trigger("sticky_kit:detach");
      } else {
        make_sticky();
      }
    });
});