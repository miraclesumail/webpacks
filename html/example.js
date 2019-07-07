require('./main.css');

import printMe from './print.js';

function component() {
 var element = document.createElement('div');
 var btn = document.createElement('button');
 btn.innerHTML = 'Click 1me and check 1the console!';
 btn.onclick = printMe;
 element.appendChild(btn);
 return element;
}

document.body.appendChild(component());
var h1 = document.createElement('h1');
h1.innerHTML = 'Hello world!';
document.body.appendChild(h1);

$('h1').click(() => {
    //  import('./lazyload').then(module => {
    //     module.showAlert();
    //  });
})