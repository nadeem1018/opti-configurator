function set_active_block() {
  $(".one_step_block").hide();
  var active_div = $("div.f1-step.active").attr("id");
  $("fieldset[data-block_id='" + active_div + "']").show();
}

function go_to_previous(previous_block) {
  $("div.f1-step.active").removeClass("active");
  $("#" + previous_block).addClass("active");
  set_active_block();
}

function go_to_next(next_block) {
  $("div.f1-step.active").removeClass("active");
  $("#" + next_block).addClass("active");
  set_active_block();
}

function calculate_progress(progress_block) {
  var block_num = $("#" + progress_block).data("step");
  var new_width = ($("#" + progress_block).offset().left) - ($("div.f1-progress").offset().left) + 50;
  $("div.f1-progress-line").attr("style", "width: " + new_width + "px")
}

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
    var input_id = $(this).parents("tbody.lookup_table_body").attr("name");
    $("#"+input_id).trigger("keyup");
   //  $("#lookup_modal").modal("hide");

  });
  
  $(document).on("click", ".custom_menu_click", function(){
    var obj = $(this);
    if (obj.parents("li.li_with_dd").find(".custom_menu_click_option").is(":visible") == false){

      obj.parents("li.li_with_dd").find(".custom_menu_click_option").attr("style", "display:block !important;");
    } else if (obj.parents("li.li_with_dd").find(".custom_menu_click_option").is(":visible") == true) {
      obj.parents("li.li_with_dd").find(".custom_menu_click_option").attr("style", "display:none !important;");
    }

  });

  // wizard JS 

  $(".btn-previous").on("click", function () {
    var p_obj = $(this);
    var previous_block = p_obj.data("previous-block");
    calculate_progress(previous_block);
    go_to_previous(previous_block);

  });

  $(".btn-next").on("click", function () {
    var n_obj = $(this);
    
    var next_block = n_obj.data("next-block");
    calculate_progress(next_block);
    go_to_next(next_block);
  });


})(jQuery); // End of use strict
