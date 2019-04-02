import React, { useEffect, useState }  from 'react';
import format from 'date-fns/format';
import { getSuite, getSuiteResults, getSuiteTests, executeSuite } from './api';
import './dashboard.css'

const baseUrl = 'https://app.ghostinspector.com'

const ErrorMessage = ({ message }) => (
  <span>
    {message} Please try updating your <a href="options-general.php?page=ghost-inspector-settings">settings</a>.
  </span>
)

const Dashboard = ({ suiteId, executeEnabled }) => {
  const [tests, setTests] = useState([])
  const [suite, setSuite] = useState({})
  const [isSuiteRunning, setSuiteRunning] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fetchTests = async () => {
    try {
      const tests = await getSuiteTests(suiteId)
      setTests(tests)
    } catch (error) {
      setErrorMessage(<ErrorMessage message={error.message} />)
    }
  }
  const fetchSuite = async () => {
    try {
      const suite = await getSuite(suiteId)
      setSuite(suite)
    } catch (error) {
      setErrorMessage(<ErrorMessage message={error.message} />)
    }
  }
  const triggerExecuteSuite = async () => {
    setSuiteRunning(true)
    const suite = await executeSuite(suiteId)
    const suiteResults = await getSuiteResults(suite._id)
    setSuiteRunning(false)
    return suiteResults
  }
  useEffect(() => {
    if (suiteId) {
      fetchTests()
      fetchSuite()
    } else {
      setErrorMessage(<ErrorMessage message={'Could not find your suite ID.'} />)
    }
  }, [])
  if (errorMessage) {
    return <div>{errorMessage}</div>
  }
  const total = tests.length
  const totalPassing = tests.filter(test => test.passing === true).length
  return (
    <div className="ghost_inspector_wrapper">
      <p className="ghost_inspector_header">Latest results for suite: <a href={`${baseUrl}/suites/${suiteId}`} target="_blank" rel="noopener noreferrer" className="ghost_inspector_suite_name">{suite.name}</a> ({totalPassing}/{total} passing)</p>
      <div className="ghost_inspector_tests">
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Last Run</th>
            </tr>
          </thead>
          <tbody>
          {tests.map(test => (
            <tr key={test._id}>
              <td>
                <a href={`${baseUrl}/tests/${test._id}`} target="_blank" rel="noopener noreferrer">{test.name}</a>
              </td>
              <td className="ghost_inspector_status">
                <span className={`dashicons dashicons-${test.passing ? 'yes' : 'no'}`}></span>
                {format(new Date(test.dateExecutionFinished), 'MMM D')}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {executeEnabled && <p><button type="button" className="button button-primary" onClick={triggerExecuteSuite} disabled={isSuiteRunning}>Run Test Suite</button></p>}
    </div>
  );
}

export default Dashboard;
