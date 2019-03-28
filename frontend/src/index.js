import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import Settings from './Settings';

const { suiteId, urls, executeEnabled, nonce } = window.gi_ajax;
const dashboardContainer = document.getElementById('ghost_inspector_dashboard');
const settingsContainer = document.getElementById('ghost_inspector_settings');
if (dashboardContainer) {
  ReactDOM.render(<Dashboard suiteId={suiteId} executeEnabled={executeEnabled} />, dashboardContainer);
}
if (settingsContainer) {
  ReactDOM.render(<Settings nonce={nonce} urls={urls} />, settingsContainer);
}
