import React, { useEffect, useState }  from 'react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('')
  const [suiteId, setSuiteId] = useState('')
  const updateApiKey = (event) => setApiKey(event.target.value)
  const updateSuiteId = (event) => setSuiteId(event.target.value)
  const updateSettings = (event) => {
    event.preventDefault()
    console.log(apiKey, suiteId)
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
