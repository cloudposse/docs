import 'waypoints/lib/noframework.waypoints'

document.addEventListener('DOMContentLoaded', () => {

  const toc = document.getElementById('TableOfContents');

  if (toc) {
    const menuItems = toc.getElementsByTagName('a');
    const page = document.querySelector('.page-content');
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
})
