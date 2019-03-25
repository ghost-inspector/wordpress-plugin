import React, { useEffect, useState }  from 'react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('')
  const [suiteId, setSuiteId] = useState('')
  const updateApiKey = (event) => setApiKey(event.target.value)
  const updateSuiteId = (event) => setSuiteId(event.target.value)
  const updateSettings = async (event) => {
    event.preventDefault()
    return await fetch(window.gi_ajax.urls.settings, {
      body: JSON.stringify({ apiKey, suiteId }), // Coordinate the body type with 'Content-Type'
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    })
  }
  const getSettings = async () => {
    const response = await fetch(window.gi_ajax.urls.settings)
    const json = await response.json()
    setApiKey(json.value.apiKey)
    setSuiteId(json.value.suiteId)
  }
  useEffect(() => {
    getSettings()
  }, [])
  return (
    <form onSubmit={updateSettings}>
      <p><label>API Key: <input type="text" value={apiKey} onChange={updateApiKey} /></label></p>
      <p><label>Suite ID: <input type="text" value={suiteId} onChange={updateSuiteId} /></label></p>
      <p><button type="submit" className="button button-primary">Submit</button></p>
    </form>
  );
}

export default Settings;
