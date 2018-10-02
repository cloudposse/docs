'use strict';

import jQuery from 'jquery/dist/jquery.slim';

import './glossarizer'
import './clipboard';
import './ui';
import './search';
import './featherlight'


$(document).ready(function () {


// TODO: Check if this code needed 
// ====================================

  var ajax;
  $('[data-search-input]').on('input', function () {
    var input = $(this),
      value = input.val(),
      items = $('[data-nav-id]');
    items.removeClass('search-match');
    if (!value.length) {
      $('ul.menu').removeClass('searched');
      items.css('display', 'block');
      sessionStorage.removeItem('search-value');
      $("article").unhighlight({
        element: 'mark'
      })
      return;
    }

    sessionStorage.setItem('search-value', value);
    $("article").unhighlight({
      element: 'mark'
    }).highlight(value, {
      element: 'mark'
    });

    if (ajax && ajax.abort) ajax.abort();

    $('[data-search-clear]').on('click', function () {
      $('[data-search-input]').val('').trigger('input');
      sessionStorage.removeItem('search-input');
      $("article").unhighlight({
        element: 'mark'
      })
    });
  });

  $.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
      return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
  });

  if (sessionStorage.getItem('search-value')) {
    var searchValue = sessionStorage.getItem('search-value')
    sessionStorage.removeItem('search-value');
    var searchedElem = $('article').find(':contains(' + searchValue + ')').get(0);
    searchedElem && searchedElem.scrollIntoView();
    $("article").highlight(searchValue, {
      element: 'mark'
    });
  }
});
// ====================================

$.extend({
  highlight: function (node, re, nodeName, className) {
    if (node.nodeType === 3) {
      var match = node.data.match(re);
      if (match && !$(node.parentNode).hasClass("mermaid")) {
        var highlight = document.createElement(nodeName || 'span');
        highlight.className = className || 'highlight';
        var wordNode = node.splitText(match.index);
        wordNode.splitText(match[0].length);
        var wordClone = wordNode.cloneNode(true);
        highlight.appendChild(wordClone);
        wordNode.parentNode.replaceChild(highlight, wordNode);
        return 1; //skip added node in parent
      }
    } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
      !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
      !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
      for (var i = 0; i < node.childNodes.length; i++) {
        i += $.highlight(node.childNodes[i], re, nodeName, className);
      }
    }
    return 0;
  }
});

$.fn.unhighlight = function (options) {
  var settings = {
    className: 'highlight',
    element: 'span'
  };
  $.extend(settings, options);

  return this.find(settings.element + "." + settings.className).each(function () {
    var parent = this.parentNode;
    parent.replaceChild(this.firstChild, this);
    parent.normalize();
  }).end();
};

$.fn.highlight = function (words, options) {
  var settings = {
    className: 'highlight',
    element: 'span',
    caseSensitive: false,
    wordsOnly: false
  };
  $.extend(settings, options);

  if (!words) {
    return;
  }

  if (words.constructor === String) {
    words = [words];
  }
  words = $.grep(words, function (word, i) {
    return word != '';
  });
  words = $.map(words, function (word, i) {
    return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  });
  if (words.length == 0) {
    return this;
  };

  var flag = settings.caseSensitive ? "" : "i";
  var pattern = "(" + words.join("|") + ")";
  if (settings.wordsOnly) {
    pattern = "\\b" + pattern + "\\b";
  }
  var re = new RegExp(pattern, flag);

  return this.each(function () {
    $.highlight(this, re, settings.element, settings.className);
  });
};




// TODO: manage calendly with webback externals.
Calendly.initBadgeWidget({
  url: 'https://calendly.com/cloudposse/30min',
  text: 'Schedule Support',
  branding: false
});

import Raven from 'raven-js';

Raven.config('https://72b1f378ef704deca7ec819c9507a141@sentry.io/1019189').install();