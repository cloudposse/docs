$(function(){
  $('.page').glossarizer({
    sourceURL: '/js/glossary.json',
    callback: function(){
      // Callback fired after glossarizer finishes its job
      new tooltip();
    }
  });
});

Calendly.initBadgeWidget({url: 'https://calendly.com/cloudposse/30min', text: 'Schedule Support', branding: false});
