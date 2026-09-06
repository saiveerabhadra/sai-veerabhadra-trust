/* Load shared header and footer before page-specific behavior. */
(async function loadLayout() {
  const layoutRoot = new URL('./', document.baseURI);
  const [headerResponse, footerResponse] = await Promise.all([
    fetch(new URL('header.html', layoutRoot)),
    fetch(new URL('footer.html', layoutRoot))
  ]);

  if (!headerResponse.ok || !footerResponse.ok) {
    throw new Error('Unable to load the shared header or footer. Use Live Server.');
  }

  const [headerHtml, footerHtml] = await Promise.all([
    headerResponse.text(),
    footerResponse.text()
  ]);

  const headerTarget = document.getElementById('site-header');
  const footerTarget = document.getElementById('site-footer');
  if (headerTarget) headerTarget.outerHTML = headerHtml;
  if (footerTarget) footerTarget.outerHTML = footerHtml;

  const mainScript = document.createElement('script');
  mainScript.src = '../js/main.js';
  document.body.appendChild(mainScript);
})().catch(error => {
  console.error(error);
});
