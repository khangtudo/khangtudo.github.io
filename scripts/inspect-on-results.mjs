import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Find onResults function and gesture recognition
const onResultsIdx = html.indexOf('function onResults(results)');
console.log(html.substring(onResultsIdx, onResultsIdx + 1500));
