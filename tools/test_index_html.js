const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');

const appDir = path.join(__dirname, '..', 'app');
const indexBuildPath = path.join(appDir, 'index-build.html');
const buildDir = path.join(appDir, 'build');

if (!fs.existsSync(buildDir)) {
  console.error('The build directory was not found. Run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(indexBuildPath)) {
  console.error('The index-build.html file was not found under app/.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexBuildPath, 'utf8');
const dom = jsdom.jsdom(indexHtml);
const document = dom.defaultView && dom.defaultView.document ? dom.defaultView.document : dom;

const selectors = ['link[href]', 'script[src]'];
const resourceNodes = selectors
  .map((selector) => Array.from(document.querySelectorAll(selector)))
  .reduce((all, nodes) => all.concat(nodes), []);

const missingResources = [];

resourceNodes.forEach((node) => {
  const attribute = node.tagName === 'LINK' ? 'href' : 'src';
  const value = node.getAttribute(attribute);

  if (!value) {
    return;
  }

  // Skip external resources referenced by URL.
  if (/^(?:https?:)?\/\//i.test(value)) {
    return;
  }

  const resourcePath = path.join(appDir, value);
  if (!fs.existsSync(resourcePath)) {
    missingResources.push(value);
  }
});

if (missingResources.length > 0) {
  console.error('index-build.html references missing resources:');
  missingResources.forEach((resource) => console.error(` - ${resource}`));
  process.exit(1);
}

const startup = document.querySelector('#startup');
if (!startup) {
  console.error('The #startup element is missing from index-build.html.');
  process.exit(1);
}

console.log('index-build.html passed resource validation.');
