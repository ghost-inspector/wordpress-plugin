import React, { useEffect, useState }  from 'react';
import format from 'date-fns/format';
import { getSuiteTests } from './api';

const baseUrl = 'https://app.ghostinspectortest.com' // TODO: move to env variables
const suiteId = '5be210847a05a37dcf89fc43' // TODO: get from widget PHP (WP settings)

const App = () => {
  const [tests, setTests] = useState([])
  const fetchTests = async () => {
    const tests = await getSuiteTests(suiteId)
    setTests(tests)
  }
  useEffect(() => {
    fetchTests()
  }, [])

  const total = tests.length
  const totalPassing = tests.filter(test => test.passing === true).length
  return (
    <div className="community-events">
      <p>Latest Test Results for Suite [Suite Name] ({totalPassing}/{total} passing)</p>
      <ul>
        {tests.map(test => (
          <li key={test._id}>
            <a href={`${baseUrl}/tests/${test._id}`}>{test.name}</a> | {test.passing ? 'passing' : 'failing'} | Completed on {format(new Date(test.dateExecutionFinished), 'MMM D, YYYY @ h:mm:ss A')}
          </li>
        ))}
      </ul>
      <p><a href="#">Run Test Suite</a></p>
    </div>
  );
}

export default App;
