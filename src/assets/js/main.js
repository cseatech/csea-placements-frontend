// import {jQuery} from 'jquery';
// jQuery(document).ready(function ($) {
//   // Your code here


// // toggle = document.querySelectorAll(".toggle")[0];
// // nav = document.querySelectorAll("nav")[0];
// // toggle_open_text = 'Menu';
// // toggle_close_text = 'Close';

// // toggle.addEventListener('click', function() {
// // 	nav.classList.toggle('open');
	
// //   if (nav.classList.contains('open')) {
// //     toggle.innerHTML = toggle_close_text;
// //   } else {
// //     toggle.innerHTML = toggle_open_text;
// //   }
// // }, false);

// // setTimeout(function(){
// // 	nav.classList.toggle('open');	
// // }, 800);


// // $(".menu").click(function () {
// //   $(this).parent().toggleClass("close");
// // });

// // why it doesn't work on firefox?


// //kid animation
// //GSAP variables

// //Navbar


// var nav = $('nav');
// var line = $('<div />').addClass('line');
// line.appendTo('.active');

// var active = nav.find('.active');
// var pos = 0;
// var wid = 0;

// if(active.length) {
//   pos = active.position().left;
//   wid = active.width();
//   line.css({
//     left: pos,
//     width: wid
//   });
// }



// nav.find(' li a').click(function(e) {
//   e.preventDefault();
//   if(!$(this).parent().hasClass('active') && !nav.hasClass('animate')) {
    
//     nav.addClass('animate');

//     var _this = $(this);

//     nav.find('li').removeClass('active');

//     var position = _this.parent().position();
//     var width = _this.parent().width();

//     if(position.left >= pos) {
//       line.animate({
//         width: ((position.left - pos) + width)
//       }, 300, function() {
//         line.animate({
//           width: width,
//           left: position.left
//         }, 150, function() {
//           nav.removeClass('animate');
//         });
//         _this.parent().addClass('active');
//       });
//     } else {
//       line.animate({
//         left: position.left,
//         width: ((pos - position.left) + wid)
//       }, 300, function() {
//         line.animate({
//           width: width
//         }, 150, function() {
//           nav.removeClass('animate');
//         });
//         _this.parent().addClass('active');
//       });
//     }

//     pos = position.left;
//     wid = width;
//   }
// });



// // Timeline

// var items = document.querySelectorAll(".timeline li");

// function isElementInViewport(el) {
//   var rect = el.getBoundingClientRect();
//   return (
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }

// function callbackFunc() {
//   for (var i = 0; i < items.length; i++) {
//     if (isElementInViewport(items[i])) {
//       if(!items[i].classList.contains("in-view")){
//         items[i].classList.add("in-view");
//       }
//     } else if(items[i].classList.contains("in-view")) {
//         items[i].classList.remove("in-view");
//     }
//   }
// }
 
// window.addEventListener("load", callbackFunc);
// window.addEventListener("scroll", callbackFunc);
// // Timeline end






// // (function ($) {
// //   "use strict";

// //   // Dropdown on mouse hover
// //   $(document).ready(function () {
// //     function toggleNavbarMethod() {
// //       if ($(window).width() > 992) {
// //         $(".navbar .dropdown")
// //           .on("mouseover", function () {
// //             $(".dropdown-toggle", this).trigger("click");
// //           })
// //           .on("mouseout", function () {
// //             $(".dropdown-toggle", this).trigger("click").blur();
// //           });
// //       } else {
// //         $(".navbar .dropdown").off("mouseover").off("mouseout");
// //       }
// //     }
// //     toggleNavbarMethod();
// //     $(window).resize(toggleNavbarMethod);
// //   });

// //   // Back to top button
// //   $(window).scroll(function () {
// //     if ($(this).scrollTop() > 100) {
// //       $(".back-to-top").fadeIn("slow");
// //     } else {
// //       $(".back-to-top").fadeOut("slow");
// //     }
// //   });
// //   $(".back-to-top").click(function () {
// //     $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
// //     return false;
// //   });

// //   // Portfolio isotope and filter
// //   var portfolioIsotope = $(".portfolio-container").isotope({
// //     itemSelector: ".portfolio-item",
// //     layoutMode: "fitRows",
// //   });

// //   $("#portfolio-flters li").on("click", function () {
// //     $("#portfolio-flters li").removeClass("active");
// //     $(this).addClass("active");

// //     portfolioIsotope.isotope({ filter: $(this).data("filter") });
// //   });

// //   // Post carousel
// //   $(".post-carousel").owlCarousel({
// //     autoplay: true,
// //     smartSpeed: 1500,
// //     dots: false,
// //     loop: true,
// //     nav: true,
// //     navText: [
// //       '<i class="fa fa-angle-left" aria-hidden="true"></i>',
// //       '<i class="fa fa-angle-right" aria-hidden="true"></i>',
// //     ],
// //     responsive: {
// //       0: {
// //         items: 1,
// //       },
// //       576: {
// //         items: 1,
// //       },
// //       768: {
// //         items: 2,
// //       },
// //       992: {
// //         items: 2,
// //       },
// //     },
// //   });

// //   // Testimonials carousel
// //   $(".testimonial-carousel").owlCarousel({
// //     center: true,
// //     autoplay: true,
// //     smartSpeed: 2000,
// //     dots: true,
// //     loop: true,
// //     responsive: {
// //       0: {
// //         items: 1,
// //       },
// //       576: {
// //         items: 1,
// //       },
// //       768: {
// //         items: 2,
// //       },
// //       992: {
// //         items: 3,
// //       },
// //     },
// //   });
// // })(jQuery);
// });



