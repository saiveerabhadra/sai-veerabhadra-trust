/* ===== Build: Add shared header and footer placeholders =====
  Run: node build.js
  header.html and footer.html remain the source files for every page. */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const startMarker = '<!-- @@HEADER_START@@ -->';
const endMarker = '<!-- @@HEADER_END@@ -->';
const footerStartMarker = '<!-- @@FOOTER_START@@ -->';
const footerEndMarker = '<!-- @@FOOTER_END@@ -->';
const headerPlaceholder = startMarker + '\n<div data-include="header"></div>\n' + endMarker;
const footerPlaceholder = footerStartMarker + '\n<div data-include="footer"></div>\n' + footerEndMarker;

const placeholderRe = /<!-- Header -->\s*<div id="site-header"><\/div>\s*<script src="\.\.\/js\/header\.js"><\/script>/;
const headerPlaceholderRe = /<!-- Header -->\s*<div id="site-header"><\/div>/;
const markerRe = new RegExp(startMarker + '[\\s\\S]*?' + endMarker, 'g');
const footerMarkerRe = new RegExp(footerStartMarker + '[\\s\\S]*?' + footerEndMarker, 'g');
const footerRe = /<!-- Footer -->\s*<footer class="footer">[\s\S]*?<\/footer>/;
const footerPlaceholderRe = /<!-- Footer -->\s*<div id="site-footer"><\/div>/;
const mainScript = '<script src="../js/main.js"></script>';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html') && f !== 'header.html' && f !== 'footer.html');
let updated = 0;

for (const file of files) {
  const full = path.join(pagesDir, file);
  let html = fs.readFileSync(full, 'utf8');

  if (markerRe.test(html)) {
    html = html.replace(markerRe, headerPlaceholder);
  } else if (placeholderRe.test(html)) {
    html = html.replace(placeholderRe, '<!-- Header -->\n  ' + headerPlaceholder);
  } else if (headerPlaceholderRe.test(html)) {
    html = html.replace(headerPlaceholderRe, '<!-- Header -->\n  ' + headerPlaceholder);
  } else {
    console.log('SKIP (no header block): ' + file);
  }

  if (footerMarkerRe.test(html)) {
    html = html.replace(footerMarkerRe, footerPlaceholder);
  } else if (footerRe.test(html)) {
    html = html.replace(footerRe, footerPlaceholder);
  } else if (footerPlaceholderRe.test(html)) {
    html = html.replace(footerPlaceholderRe, footerPlaceholder);
  } else {
    console.log('SKIP (no footer block): ' + file);
  }

  html = html.replace(/\s*<script src="\.\.\/js\/(?:main|layout|load-components)\.js"><\/script>/, '\n  <script src="../js/load-components.js"></script>');
  if (!html.includes('load-components.js')) {
    html = html.replace(mainScript, '<script src="../js/load-components.js"></script>');
  }

  fs.writeFileSync(full, html, 'utf8');
  updated++;
  console.log('Updated: ' + file);
}

console.log('Done. ' + updated + ' page(s) updated.');