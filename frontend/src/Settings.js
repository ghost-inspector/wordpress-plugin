import React, { useEffect, useState }  from 'react';
import { getSuite } from './api';

const Settings = ({ nonce, urls }) => {
  const [apiKey, setApiKey] = useState('')
  const [suiteId, setSuiteId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setSaving] = useState(false)
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
    const response = await fetch(urls.settings, {
      headers: new Headers({ 'X-WP-Nonce': nonce })
    })
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
      {errorMessage && <div className="error settings-error"><p>{errorMessage}</p></div>}
      <p><button type="submit" className="button button-primary" disabled={isSaving}>Submit</button></p>
    </form>
  );
}

export default Settings;
