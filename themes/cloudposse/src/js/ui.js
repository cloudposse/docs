$(function () {
  $('.header__burger-link').click(function () {
    $(this).children('i').toggleClass('fa-rotate-90');
    $('.header__shortcuts').toggleClass('opened');
  });
});

$(function () {
  $('.subnav__nav-select-icon').click(function () {
    $(this).toggleClass('fa-rotate-90');
    $('.left-sidebar').toggleClass('opened');
  });
});

$('.category-icon').on('click', function () {
  $(this).toggleClass("fa-angle-down fa-angle-right");
  $(this).parent().parent().children('ul').toggle();
  return false;
});

// allow keyboard control for prev/next links
$(function () {
  $('.nav-prev').click(function () {
    location.href = $(this).attr('href');
  });
  $('.nav-next').click(function () {
    location.href = $(this).attr('href');
  });
});

$(document).keydown(function (e) {
  // prev links - left arrow key
  if (e.which == '37') {
    $('.nav.nav-prev').click();
  }
  // next links - right arrow key
  if (e.which == '39') {
    $('.nav.nav-next').click();
  }
});

// Burger icon click toggle header menu on small devices
$('.burger').on('click', function (e) {
  $('#shortcuts').toggleClass("responsive");
  e.preventDefault();
});

