import 'featherlight';

// Images
// Execute actions on images generated from Markdown pages
var images = $("article img, .page-content__content img").not(".inline, .no-popup");
// Wrap image inside a featherlight (to get a full size view in a popup)
images.wrap(function () {
  var image = $(this);
  if (!image.parent("a").length) {
    return "<a href='" + image[0].src + "' data-featherlight='image'></a>";
  }
});
// Change styles, depending on parameters set to the image
images.each(function (index) {
  var image = $(this);
  var o = getUrlParameter(image[0].src);
  if (typeof o !== "undefined") {
    var h = o["height"];
    var w = o["width"];
    var c = o["classes"];
    image.css({
      width: function () {
        if (typeof w !== "undefined") {
          return w;
        }
      },
      height: function () {
        if (typeof h !== "undefined") {
          return h;
        }
      }
    });
    if (typeof c !== "undefined") {
      var classes = c.split(',');
      $.each(classes, function (i) {
        image.addClass(classes[i]);
      });
    }
  }
});

// Get Parameters from some url
function getUrlParameter(sPageURL) {
  var url = sPageURL.split('?');
  var obj = {};
  if (url.length == 2) {
    var sURLVariables = url[1].split('&'),
      sParameterName,
      i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      obj[sParameterName[0]] = sParameterName[1];
    }
    return obj;
  } else {
    return undefined;
  }
};
