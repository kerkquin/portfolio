/* Navigation enhances an otherwise complete, readable static document. */
(() => {
  const nav = document.querySelector('[data-walk-nav]');
  if (nav) {
    const links = [...nav.querySelectorAll('a')];
    const stages = links.map(link => document.querySelector(link.getAttribute('href')));
    const controls = document.querySelector('[data-walk-controls]');
    const previous = controls.querySelector('[data-previous]');
    const next = controls.querySelector('[data-next]');
    const status = controls.querySelector('[data-status]');
    let current = 0;
    const show = (index, focus = false) => {
      if (index < 0 || index >= stages.length) return;
      current = index;
      stages.forEach((stage, i) => {
        stage.hidden = i !== current;
        if (i === current) links[i].setAttribute('aria-current', 'step');
        else links[i].removeAttribute('aria-current');
      });
      previous.disabled = current === 0;
      next.disabled = current === stages.length - 1;
      status.textContent = `${current + 1} of ${stages.length}`;
      if (focus) {
        history.replaceState(null, '', `#${stages[current].id}`);
        stages[current].querySelector('h2').focus({preventScroll: true});
        nav.scrollIntoView({block: 'start', behavior: 'instant'});
      }
    };
    links.forEach((link, index) => link.addEventListener('click', event => {
      event.preventDefault(); show(index, true);
    }));
    previous.addEventListener('click', () => show(current - 1, true));
    next.addEventListener('click', () => show(current + 1, true));
    const hashIndex = () => stages.findIndex(stage => `#${stage.id}` === location.hash);
    window.addEventListener('hashchange', () => show(Math.max(0, hashIndex())));
    controls.hidden = false;
    show(Math.max(0, hashIndex()));
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('enter');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    document.querySelectorAll('[data-enter]').forEach(element => observer.observe(element));
  }
})();
