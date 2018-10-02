'use strict';

import instantsearch from 'instantsearch.js/es';

const searchResults = document.getElementById('search-results');
const searchBar = document.querySelector('.search-bar');

import { 
  stats,
  searchBox,
  hits
 } from 'instantsearch.js/es/widgets';

const search = instantsearch({
  appId: '32YOERUX83',
  apiKey: '557985309adf0e4df9dcf3cb29c61928',
  indexName: document.location.hostname.match(/localhost/) === null ? 'prod' : 'dev',
  routing: true,
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

search.addWidget(stats({
  container: '#search-stats',
  templates: {
    body: "<h3>Search results for \"<em>{{query}}</em>\"</h3><span>(found {{nbHits}} results in {{processingTimeMS}} ms)</span>"
  }
}));

search.addWidget(searchBox({
  container: '#search-box',
  placeholder: 'Search',
  poweredBy: false,
  placeholder: 'Search',
  autofocus: true,
  loadingIndicator: true,
}));

search.addWidget(hits({
  container: '#search-hits',
  templates: {
    empty: "We didn't find any results for the search <em>\"{{query}}\"</em>",
    item: '<a href="{{ url }}"><p class="search-hit-container"><div><strong class="search-hit-title">{{{ _highlightResult.title.value }}}</strong><em class="section">{{{ section }}}</em></div><p class="text-overflow">{{{ _highlightResult.description.value }}}</p><em class="tags">{{{ tags_text }}}</em></div></a>',
  },
  showMoreLabel: "Load more results...",
  transformData: {
    item: function (data) {
      // Process tags
      if (data.tags) {
        const tags = data.tags.map(function (value) {
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
}));

function showHits() {
  searchBar.classList.add('active');
  setTimeout(function () {
    searchResults.classList.remove('hidden');
  }, 300);
}

function hideHits() {
  searchResults.classList.add('hidden');
  searchBar.classList.remove('active');
  //To be sure.
  setTimeout(function () {
    searchResults.classList.add('hidden');
  }, 300);
}

search.start();
