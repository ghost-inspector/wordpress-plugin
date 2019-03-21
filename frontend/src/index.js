import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

const dashboard = document.getElementById('root');
const settings = document.getElementById('gi_settings');
if (dashboard) {
  ReactDOM.render(<App suiteId={window.gi_ajax.suiteId} executeEnabled={window.gi_ajax.executeEnabled} />, dashboard);
}
if (settings) {
  // ReactDOM.render(<Settings suiteId={window.gi_ajax.suiteId} />, settings);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
