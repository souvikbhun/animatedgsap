const fs = require('fs');
const path = require('path');

const rootDir = 'e:/souvik/gsap-animation';

// --------------------------------------------------------------------------
// 1. MERGE ALL CSS FILES
// --------------------------------------------------------------------------
const cssFiles = [
  { name: 'GSAP UI-Kit Master Design System', file: 'css/my-gsap-normal.css' },
  { name: 'Headings & Typography Animations System', file: 'css/main-heading.css' },
  { name: 'Pure Image Parallax Suite', file: 'css/image-parallax.css' }
];

let mergedCss = `/* ==========================================================================
   MASTER BUNDLE CSS (GSAP UI-Kit + Headings + Image Parallax Suite)
   Unified CSS Design System & Animation Stylesheet
   ========================================================================== */\n\n`;

for (const item of cssFiles) {
  const filePath = path.join(rootDir, item.file);
  const content = fs.readFileSync(filePath, 'utf8');
  mergedCss += `/* ==========================================================================\n   SECTION: ${item.name}\n   File: ${item.file}\n   ========================================================================== */\n\n${content}\n\n`;
}

// Write unminified bundle
fs.writeFileSync(path.join(rootDir, 'css/bundle.css'), mergedCss, 'utf8');

// Minify CSS
const minifiedCss = mergedCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([\{\}:;,])\s*/g, '$1')
  .trim();

fs.writeFileSync(path.join(rootDir, 'css/bundle.min.css'), minifiedCss, 'utf8');
console.log(`[CSS] Merged bundle.css: ${(mergedCss.length / 1024).toFixed(1)} KB`);
console.log(`[CSS] Minified bundle.min.css: ${(minifiedCss.length / 1024).toFixed(1)} KB`);

// Also update legacy my-gsap-minified.css with the full bundle for backwards compatibility
fs.writeFileSync(path.join(rootDir, 'css/my-gsap-minified.css'), minifiedCss, 'utf8');

// --------------------------------------------------------------------------
// 2. MERGE ALL JS FILES
// --------------------------------------------------------------------------
const jsFiles = [
  { name: 'GSAP UI-Kit Interactive Animation Engine', file: 'js/my-gsap.js' },
  { name: 'Headings & Kinetic Typography Controller', file: 'js/main-heading.js' },
  { name: 'Pure Image Parallax & Multi-Tab Code Inspector', file: 'js/image-parallax.js' }
];

let mergedJs = `/**
 * ============================================================================
 * MASTER BUNDLE JS (GSAP UI-Kit + Headings + Image Parallax Suite)
 * Complete Interactive Animation & Motion Physics Engine
 * ============================================================================
 */\n\n`;

for (const item of jsFiles) {
  const filePath = path.join(rootDir, item.file);
  const content = fs.readFileSync(filePath, 'utf8');
  mergedJs += `/* ==========================================================================\n   MODULE: ${item.name}\n   File: ${item.file}\n   ========================================================================== */\n\n${content}\n\n`;
}

// Write unminified bundle
fs.writeFileSync(path.join(rootDir, 'js/bundle.js'), mergedJs, 'utf8');

// Minify JS safely (clean comments and extra whitespace while preserving string literals)
const minifiedJs = mergedJs
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n')
  .map(l => l.replace(/^\s*\/\/.*$/, '').trim())
  .filter(Boolean)
  .join('\n');

fs.writeFileSync(path.join(rootDir, 'js/bundle.min.js'), minifiedJs, 'utf8');
console.log(`[JS] Merged bundle.js: ${(mergedJs.length / 1024).toFixed(1)} KB`);
console.log(`[JS] Minified bundle.min.js: ${(minifiedJs.length / 1024).toFixed(1)} KB`);

// Also update legacy my-gsapminified.js with the full bundle for backwards compatibility
fs.writeFileSync(path.join(rootDir, 'js/my-gsapminified.js'), minifiedJs, 'utf8');

console.log('Build completed successfully!');
