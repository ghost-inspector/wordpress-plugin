import React, { useState }  from 'react';

const request = async (endpoint, params = {}) => {
  const { urls } = window.gi_ajax
  const response = await fetch(`${urls.proxy}&${new URLSearchParams(Object.entries({
    ...params,
    endpoint
  }))}`)
  const json = await response.json()
  if (json.code === 'SUCCESS') {
    return json.data
  } else {
    throw new Error(json.message)
  }
}

const Settings = () => {
  const [apiKey, setApiKey] = useState('')
  const [suiteId, setSuiteId] = useState('')
  const updateApiKey = (event) => setApiKey(event.target.value)
  const updateSuiteId = (event) => setSuiteId(event.target.value)
  const updateSettings = async (event) => {
    event.preventDefault()
    console.log(apiKey, suiteId)
    const response = await fetch(window.gi_ajax.urls.settings, {
      body: JSON.stringify({ apiKey, suiteId }), // Coordinate the body type with 'Content-Type'
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    })
    const json = await response.json()
    console.log(json)
  }
  return (
    <form onSubmit={updateSettings}>
      <p><label>API Key: <input type="text" value={apiKey} onChange={updateApiKey} /></label></p>
      <p><label>Suite ID: <input type="text" value={suiteId} onChange={updateSuiteId} /></label></p>
      <p><button type="submit" className="button button-primary">Submit</button></p>
    </form>
  );
}

export default Settings;
