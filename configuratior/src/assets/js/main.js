(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($window.width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

  $(document).on('click', 'a.drpdown_menu', function (event) {
    var cobj = $(this);
    var target_id = cobj.attr('id');
    var target_obj = $("div[data-target='" + target_id + "']");
    var visible_status = target_obj.attr('data-status');
    if (visible_status == "0"){
      cobj.find(".inner_menu_icon").removeClass("fa-angle-right").addClass('fa-angle-down');
      target_obj.attr("data-status", "1");
    } else if (visible_status == "1") {
      cobj.find(".inner_menu_icon").removeClass("fa-angle-down").addClass('fa-angle-right');
      target_obj.attr("data-status", "0");
    }
    target_obj.slideToggle();
  });

  $(".gototop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  $(document).on("click", ".row_select, .row_select td",  function(){
    $("#lookup_modal").modal("hide");
  });
  


})(jQuery); // End of use strict
