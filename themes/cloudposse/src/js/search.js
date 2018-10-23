'use strict';

import instantsearch from 'instantsearch.js/es';

import {
  stats,
  searchBox,
  hits,
  hitsPerPageSelector,
  pagination
 } from 'instantsearch.js/es/widgets';

const searchResults = document.getElementById('search-results');
const searchBar = document.querySelector('.search-bar');
const searchMore = document.querySelector('.search-more');
const searchMoreLink = document.querySelector('.search-more__link');

let hitsContainer, statsContainer, listMax;

// If it is search page.
if (document.querySelector('.page-search-results')) {
  hitsContainer = document.getElementById('search-hits-page');
  statsContainer = document.getElementById('search-stats-page');
  listMax = 20;
} else {
  hitsContainer = document.getElementById('search-hits');
  statsContainer = document.getElementById('search-stats');
  listMax = 5;
}

const search = instantsearch({
  appId: '32YOERUX83',
  apiKey: '557985309adf0e4df9dcf3cb29c61928',
  indexName: document.location.hostname.match(/localhost/) === null ? 'prod' : 'dev',
  routing: true,
  searchParameters: {
    hitsPerPage: listMax
  },
  searchFunction(helper) {
    let query = helper.state.query;

    if (query === '') {
      hideHits();
      hideMore();
      return;
    }

    if (query.length === 1) {
      showHits();

      if (searchMoreLink) {
        showMore(query);
      }
    }
    helper.search();
  }
});

search.addWidget(stats({
  container: statsContainer,
  templates: {
    body: "<h3>Search results for \"<em>{{query}}</em>\"</h3><span>(found {{nbHits}} results in {{processingTimeMS}} ms)</span>"
  }
}));

if (document.querySelector('.page-search-results')) {
  search.addWidget(hitsPerPageSelector({
    container: '#hits-per-page-selector',
    items: [{
        value: 20,
        label: '20 per page',
        default: true
      },
      {
        value: 50,
        label: '50 per page'
      },
      {
        value: 100,
        label: '100 per page'
      },
    ]
  }));
  search.addWidget(
    pagination({
      container: '#pagination-container',
      maxPages: 20,
      scrollTo: false,
      showFirstLast: false,
      cssClasses: {
        root: "pagination",
        item: "page-item",
        link: "page-link",
        active: "active"
      }
    })
  );
}

search.addWidget(searchBox({
  container: '#search-box',
  placeholder: 'Search',
  poweredBy: false,
  placeholder: 'Search',
  autofocus: true,
  loadingIndicator: true,
}));

search.addWidget(hits({
  hitsPerPage: 5,
  container: hitsContainer,
  templates: {
    empty: "We didn't find any results for the search <em>\"{{query}}\"</em>",
    item: '<a href="{{ url }}"><div class="search-hit-container"><div><strong class="search-hit-title">{{{ _highlightResult.title.value }}}</strong><em class="section">{{{ section }}}</em></div><p class="text-overflow">{{{ _highlightResult.description.value }}}</p><em class="tags">{{{ tags_text }}}</em></div></a>',
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

function showMore(query) {
  searchMoreLink.setAttribute('href', '/search/?query=' + query);
  searchMore.classList.add('visible');
}

function hideMore() {
  searchMore.classList.remove('visible');
}

search.start();
