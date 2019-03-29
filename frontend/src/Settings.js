import React, { useEffect, useState }  from 'react';
import { getSuite } from './api';

const Settings = ({ nonce, urls }) => {
  const [apiKey, setApiKey] = useState('')
  const [suiteId, setSuiteId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setSaving] = useState(false)
  const [isGetting, setGetting] = useState(true)
  const updateApiKey = (event) => setApiKey(event.target.value)
  const updateSuiteId = (event) => setSuiteId(event.target.value)
  const updateSettings = async (event) => {
    event.preventDefault()
    setSaving(true)
    // check if API key and suite ID are valid
    try {
      await getSuite(suiteId)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message)
    }
    await fetch(urls.settings, {
      body: JSON.stringify({ apiKey, suiteId }),
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce
      }),
    })
    setSaving(false)
  }
  const getSettings = async () => {
    let json = null
    let elapsed = false
    setGetting(true)
    // display loading for a minimum amount of time to prevent flashing
    setTimeout(() => {
      elapsed = true
      if (json) {
        setGetting(false)
      }
    }, 300)
    const response = await fetch(urls.settings, {
      headers: new Headers({ 'X-WP-Nonce': nonce })
    })
    json = await response.json()
    setApiKey(json.value.apiKey)
    setSuiteId(json.value.suiteId)
    if (elapsed) {
      setGetting(false)
    }
  }
  useEffect(() => {
    getSettings()
  }, [])
  if (isGetting) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <h1>Ghost Inspector Settings</h1>
      <h2>Automated Website Testing Made Easy</h2>
      {!apiKey && <p><a href="https://app.ghostinspector.com/account" target="_blank" rel="noopener noreferrer" className="button button-primary">Login or sign up to get your API key</a></p>}
      <form onSubmit={updateSettings}>
        <p><label>API Key: <input type="password" value={apiKey} onChange={updateApiKey} /></label></p>
        <p><label>Suite ID: <input type="text" value={suiteId} onChange={updateSuiteId} /></label></p>
        {errorMessage && <div className="error settings-error"><p>{errorMessage}</p></div>}
        <p><button type="submit" className="button button-primary" disabled={isSaving}>Submit</button></p>
      </form>
    </div>
  );
}

export default Settings;
