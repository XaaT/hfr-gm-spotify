// ==UserScript==
// @name [HFR] Spotify
// @version 0.0.3
// @namespace xat.azora.fr
// @description Remplacer un lien/URI Spotify par le lecteur spotify
// @downloadURL   https://raw.githubusercontent.com/XaaT/hfr-gm-spotify/master/hfr-spotify.user.js
// @updateURL     https://raw.githubusercontent.com/XaaT/hfr-gm-spotify/master/hfr-spotify.user.js
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/hfr/*
// @include       https://forum.hardware.fr
// @include       https://forum.hardware.fr/
// @grant GM_info
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// ==/UserScript==

(function() {
  var SELECTOR = '.spoiler .cLink, .messCase2 > div[id] > p > .cLink';
  var HEIGHT = 315;
  var WIDTH = 560;
  var HASH = /#.*$/;
  var matchers = [
      /http(?:s)?\:\/\/(?:open.)?(spotify)\.com\/track\/([\w\-_]+)/,
	  /http(?:s)?\:\/\/(?:open.)?(spotif)y\.com\/album\/([\w\-_]+)/
  ];

  var roots = {
	spotify:	'https://embed.spotify.com/?uri=spotify:track:',
	spotif:		'https://embed.spotify.com/?uri=spotify:album:',
  };

  function onClickReplaceWith(el, iframe) {
    el.addEventListener('click', function(e) {
      el.parentNode.replaceChild(iframe, el);
      e.preventDefault();
    });
  }

  var i, l, link, links = document.querySelectorAll(SELECTOR);

  for(i = 0, l = links.length; i < l; i += 1) {
    link = links[i];
    var href = link.href;
    var img = link.querySelector('img');
    var text = link.textContent;
    var h = href.match(HASH);

    matchers.forEach(function(matcher) {
      if(matcher.test(href)) {
        var tokens = href.match(matcher);
        var name = tokens[1];
        var src = tokens[2];
        var hash = h ? h[0] : '';

        var iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('webkitAllowFullScreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('src', roots[name] + src + hash);
        iframe.setAttribute('width', WIDTH);
        iframe.setAttribute('height', HEIGHT);

        if(text.indexOf('http') === 0) {
          link.parentNode.replaceChild(iframe, link);
        } else {
          onClickReplaceWith(img || link, iframe);
        }
      }
    });
  }
}());
