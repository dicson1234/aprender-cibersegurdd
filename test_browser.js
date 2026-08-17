const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { 
    url: "http://localhost:8080/",
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.onerror = function(message, source, lineno, colno, error) {
    console.error("BROWSER ERROR:", message, error);
};

// We don't wait for resources, we just evaluate the scripts manually in order to catch the exact error.
const scripts = [
    './js/storage.js',
    './js/gamification.js',
    './js/datasets.js',
    './js/navigation.js',
    './js/dashboard.js',
    './js/knowledge_map.js',
    './js/learning_tree.js',
    './js/labs_engine.js',
    './js/quizzes_engine.js',
    './js/spaced_repetition.js',
    './js/notes_engine.js',
    './js/resources_engine.js',
    './js/cybertutor.js',
    './js/search.js',
    './js/app.js'
];

for (const script of scripts) {
    try {
        const code = fs.readFileSync(script, 'utf8');
        dom.window.eval(code);
    } catch (e) {
        console.error(`ERROR in ${script}:`, e);
    }
}
console.log("Finished script loading.");
