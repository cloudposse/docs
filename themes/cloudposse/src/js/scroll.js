import SimpleScrollbar from 'simple-scrollbar'
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
  }
})
