import React, { useEffect, useState }  from 'react';
import format from 'date-fns/format';
import { getSuite, getSuiteResults, getSuiteTests, executeSuite } from './api';

const baseUrl = 'https://app.ghostinspectortest.com' // TODO: move to env variables

const App = () => {
  const [tests, setTests] = useState([])
  const [suite, setSuite] = useState({})
  const [isSuiteRunning, setSuiteRunning] = useState(false)
  const fetchTests = async () => {
    const tests = await getSuiteTests()
    setTests(tests)
  }
  const fetchSuite = async () => {
    const suite = await getSuite()
    setSuite(suite)
  }
  const triggerExecuteSuite = async () => {
    setSuiteRunning(true)
    const suite = await executeSuite()
    const suiteResults = await getSuiteResults(suite._id)
    setSuiteRunning(false)
    return suiteResults
  }
  useEffect(() => {
    setTimeout(() => {
      fetchTests()
      fetchSuite()
    }, 1000)
  }, [])
  const total = tests.length
  const totalPassing = tests.filter(test => test.passing === true).length
  return (
    <div className="community-events">
      <p>Latest Test Results for Suite {suite.name} ({totalPassing}/{total} passing)</p>
      <ul>
        {tests.map(test => (
          <li key={test._id}>
            <a href={`${baseUrl}/tests/${test._id}`}>{test.name}</a> | {test.passing ? 'passing' : 'failing'} | Completed on {format(new Date(test.dateExecutionFinished), 'MMM D, YYYY @ h:mm:ss A')}
          </li>
        ))}
      </ul>
      <p><button type="button" onClick={triggerExecuteSuite} disabled={isSuiteRunning}>Run Test Suite</button></p>
    </div>
  );
}

export default App;
