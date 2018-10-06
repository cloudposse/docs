import 'glossarizer'
import './vendors/tooltip';

$('.page-content').glossarizer({
  sourceURL: '/glossary.json',
  callback: function () {
    // Callback fired after glossarizer finishes its job
    tooltip();
  }
});

$(".anchor").on('mouseleave', function (e) {
  $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
});
