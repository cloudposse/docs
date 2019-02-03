import SimpleScrollbar from 'simple-scrollbar'

const categories = document.getElementsByClassName('homepage__items-wrapper--depth1');

for (let category of categories) {
  category.classList.add('scroll-processed');
  SimpleScrollbar.initEl(category);
}
