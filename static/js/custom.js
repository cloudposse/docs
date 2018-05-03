$(function(){
  $('.page').glossarizer({
    sourceURL: '/js/glossary.json',
    callback: function(){
      // Callback fired after glossarizer finishes its job
      new tooltip();
    }
  });
});

