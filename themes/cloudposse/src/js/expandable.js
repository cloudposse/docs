
document.addEventListener('DOMContentLoaded', () => {
  Array.prototype.forEach.call(document.querySelectorAll('.dialog.code-block'), function (code) {
    let highlight = code.querySelector('pre');

    if (highlight.offsetHeight > 250) {
      code.classList.add('collapsed');

      const link = document.createElement('button');
      link.innerText = 'More';
      link.classList.add('btn', 'btn-link');
      code.appendChild(link);

      link.addEventListener('click', () => {
        code.classList.toggle('collapsed');
        if (link.innerText == 'More') {
          link.innerText = 'Less'
        }
        else {
          link.innerText = 'More'
        }
      })
    }
  });
});
