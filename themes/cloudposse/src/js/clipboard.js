import ClipboardJS from 'clipboard';

// Clipboard
// Add link button for every
var text, clip = new ClipboardJS('.anchor');
$(".page-content__content :header").append(function (index, html) {
  var element = $(this);
  var url = document.location.origin + document.location.pathname;
  var link = url + "#" + element[0].id;
  return " <span class='anchor' data-clipboard-text='" + link + "'>" +
    "<i class='fa fa-link fa-lg'></i>" +
    "</span>";
});

clip.on('success', function (e) {
  e.clearSelection();
  $(e.trigger).attr('aria-label', 'Link copied to clipboard!').addClass('tooltipped tooltipped-s');
});

// clipboard
var clipInit = false;
$('pre code').each(function () {
  var code = $(this),
    text = code.text();

  console.log(code);
    
  if (text.length > 5) {
    if (!clipInit) {
      var text, clip = new ClipboardJS('.copy-to-clipboard', {
        text: function (trigger) {
          text = $(trigger).next('code').text();
          return text.replace(/^\$\s/gm, '');
        }
      });

      var inPre;
      clip.on('success', function (e) {
        e.clearSelection();
        inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
        $(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
      });

      clip.on('error', function (e) {
        inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
        $(e.trigger).attr('aria-label', fallbackMessage(e.action)).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
        $(document).one('copy', function () {
          $(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
        });
      });

      clipInit = true;
    }

    code.before('<span class="copy-to-clipboard" title="Copy to clipboard"><span class="fa fa-clipboard" aria-hidden="true"></span></span>');
    $('.copy-to-clipboard').on('mouseleave', function () {
      $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
    });
  }
});