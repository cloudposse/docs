import SimpleScrollbar from 'simple-scrollbar'
import 'waypoints/lib/noframework.waypoints'
const elementsToScroll = [
  'homepage__items-wrapper--depth1',
  'left-sidebar__scroller',
  'page-content'
]

document.addEventListener('DOMContentLoaded', () => {

  for (let i = 0; i < elementsToScroll.length; i++) {
    const categories = document.getElementsByClassName(elementsToScroll[i]);

    Array.prototype.forEach.call(categories, function (category) {
      category.classList.add('scroll-processed');
      SimpleScrollbar.initEl(category);
    });

    const toc = document.getElementById('TableOfContents');
    const page = document.querySelector('.page-content .ss-content');
    if (toc && page) {
      const menuItems = toc.getElementsByTagName('a');
      const links = [];

      Array.prototype.forEach.call(menuItems, function (el) {
        let href = el.getAttribute('href');
        if (href) {
          links.push({
            'href': document.querySelector(href),
            'item': el
          });
        }
      });


      links.forEach((link) => {
        var upWp = new Waypoint({
          element: link.href,
          context: page,
          offset: 50,
          handler: function (direction) {
            if (direction === 'up') {
              activateLink(link.item);
            }
          }
        });

        var downWp = new Waypoint({
          element: link.href,
          context: page,
          offset: 'bottom-in-view',
          handler: function (direction) {
            if (direction === 'down') {
              activateLink(link.item);
            }
          }
        });

      });

      function activateLink(link) {
        Array.prototype.forEach.call(menuItems, function (el) {
          el.classList.remove('active');
          link.classList.add('active');
        });
      }
    }
  }
})
