/* Load shared layout before starting page behavior. */
(async function loadSharedComponents() {
  const isPagesPath = window.location.pathname.includes('/pages/');
  const rootPath = isPagesPath ? '../' : './';
  const componentPath = rootPath + 'pages/';

  const loadComponent = async (name) => {
    const target = document.querySelector(`[data-include="${name}"]`);
    if (!target) return;

    const response = await fetch(`${componentPath}${name}.html`);
    if (!response.ok) throw new Error(`Unable to load ${name}.html`);
    target.outerHTML = await response.text();
  };

  try {
    await Promise.all([loadComponent('header'), loadComponent('footer')]);

    if (!isPagesPath) {
      document.querySelectorAll('.header a, .footer a').forEach((link) => {
        if (link.getAttribute('href')?.endsWith('.html')) {
          link.setAttribute('href', `pages/${link.getAttribute('href')}`);
        }
      });
      document.querySelectorAll('.header img, .footer img').forEach((image) => {
        image.src = image.src.replace('/../images/', '/images/');
      });
    }

    const mainScript = document.createElement('script');
    mainScript.src = `${rootPath}js/main.js`;
    document.body.appendChild(mainScript);
  } catch (error) {
    console.error('Shared layout failed to load:', error);
  }
})();