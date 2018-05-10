$(function(){
  $('.page').glossarizer({
    sourceURL: '/glossary.json',
    callback: function(){
      // Callback fired after glossarizer finishes its job
      new tooltip();
    }
  });
});

Calendly.initBadgeWidget({url: 'https://calendly.com/cloudposse/30min', text: 'Schedule Support', branding: false});

$(function(){
  const search = instantsearch({
    appId: '32YOERUX83',
    apiKey: '557985309adf0e4df9dcf3cb29c61928',
    indexName: 'docs',
    urlSync: true,
    searchParameters: {
      hitsPerPage: 10
    },
    searchFunction(helper) {
      if (helper.state.query === '') {
        return;
      }
      helper.search();
    }
  });

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#search-results',
      templates: {
        empty: 'No results',
        // https://caniuse.com/#feat=template-literals
        item: '<a href="{{ uri }}"><p class="search-result-container"><div><strong class="search-result-title">{{{ _highlightResult.title.value }}}</strong>{{{ tags_text }}}</div><p class="text-overflow">{{{ _highlightResult.content.value }}}</p></div></a>'
      },
      transformData: {
        item: function(data) {
          // https://caniuse.com/#search=MAP
          const tags = data.tags.map(function(value) {
            return value.toLowerCase().replace(' ', '-')
          })
          data.tags_text = tags.join(', ')
          return data
        }
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-box',
      placeholder: 'Search'
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      maxPages: 20,
      // default is to scroll to 'body', here we disable this behavior
      // scrollTo: false
    })
  );

  search.start();
});
