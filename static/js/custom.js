'use strict';

$(function(){
  $('.page-content').glossarizer({
    sourceURL: '/glossary.json',
    callback: function(){
      // Callback fired after glossarizer finishes its job
      new tooltip();
    }
  });
});

$(function(){
  $('.header__burger-link').click(function () {
    $(this).children('i').toggleClass('fa-rotate-90');
    $('.header__shortcuts').toggleClass('opened');
  });
});

Calendly.initBadgeWidget({url: 'https://calendly.com/cloudposse/30min', text: 'Schedule Support', branding: false});

$(function(){
  //console.log(document.location.hostname.match(/localhost/) === null);
  const searchResults = document.querySelector('#search-results');
  const searchBar = document.querySelector('.search-bar');

  if (searchResults === null) {
    return;
  }

  const search = instantsearch({
    appId: '32YOERUX83',
    apiKey: '557985309adf0e4df9dcf3cb29c61928',
    indexName: document.location.hostname.match(/localhost/) === null ? 'prod' : 'dev',
    urlSync: true,
    searchParameters: {
      hitsPerPage: 5
    },
    searchFunction(helper) {      
      if (helper.state.query === '') {
        hideHits();
        return;
      }
      if (helper.state.query.length === 1) {
        showHits();
      }
      helper.search();
    }
  });

  search.addWidgets(
    [
      instantsearch.widgets.stats({
        container: '#search-stats',
        templates: {
          body: "<h3>Search results for \"<em>{{query}}</em>\"</h3><span>(found {{nbHits}} results in {{processingTimeMS}} ms)</span>"
        }
      }),
      instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search',
        poweredBy: false,    
        placeholder: 'Search',
        autofocus: true,
        loadingIndicator: true,
      }),
      instantsearch.widgets.hits({
        container: '#search-hits',
        //autoHideContainer: true,
        //collapsible: true,
        templates: {
          empty: "We didn't find any results for the search <em>\"{{query}}\"</em>",
          item: '<a href="{{ url }}"><p class="search-hit-container"><div><strong class="search-hit-title">{{{ _highlightResult.title.value }}}</strong><em class="section">{{{ section }}}</em></div><p class="text-overflow">{{{ _highlightResult.description.value }}}</p><em class="tags">{{{ tags_text }}}</em></div></a>',
        },
        showMoreLabel: "Load more results...",
        transformData: {
          item: function(data) {
            // Process tags
            if(data.tags) {
              const tags = data.tags.map(function(value) {
                return '#' + value.toLowerCase().replace(' ', '-')
              })
              data.tags_text = tags.join(' ')
            } else {
              data.tags_text = ""
            }
  
            // return normalized data
            return data
          }
        }
      })
    ]
  );

  function showHits() {
    searchBar.classList.add('active');
    setTimeout(function() {
      searchResults.classList.remove('hidden');
    }, 300);
  }

  function hideHits() {
    searchResults.classList.add('hidden');
    searchBar.classList.remove('active');
    //To be sure.
    setTimeout(function() {
      searchResults.classList.add('hidden');
    }, 300);
  }

  /*
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      maxPages: 20,
      // default is to scroll to 'body', here we disable this behavior
      // scrollTo: false
    })
  );
  */

  search.start();
});
