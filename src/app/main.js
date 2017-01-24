import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

// var socket = io.connect('http://127.0.0.1:4666');
var socket = io();

console.log('Przypinamy do ');
console.log(document.getElementById('app'));
ReactDOM.render(<App />, document.getElementById('app'));
