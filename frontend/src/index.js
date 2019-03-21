import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import Settings from './Settings';
import * as serviceWorker from './serviceWorker';

const dashboardContainer = document.getElementById('ghost_inspector_dashboard');
const settingsContainer = document.getElementById('ghost_inspector_settings');
if (dashboardContainer) {
  ReactDOM.render(<Dashboard suiteId={window.gi_ajax.suiteId} executeEnabled={window.gi_ajax.executeEnabled} />, dashboardContainer);
}
if (settingsContainer) {
  ReactDOM.render(<Settings suiteId={window.gi_ajax.suiteId} />, settingsContainer);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
