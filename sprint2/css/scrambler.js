var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = browser.runtime.getURL("scrambler.css");
link.media = 'all';
head.appendChild(link);