
export const request = async (path, params = {}) => {
  // hardcoded API key (will be added on backend proxy in the future)
  params.apiKey = '767f9ef8707eef19d823b0f05c2a66e1b0949f0d'
  const url = `https://api.ghostinspectortest.com/v1${path}?${new URLSearchParams(Object.entries(params))}`  
  const response = await fetch(url)
  const json = await response.json()
  if (json.code === 'SUCCESS') {
    return json.data
  } else {
    throw new Error(json.message)
  }
}

export const getSuite = async (suiteId) => request(`/suites/${suiteId}/`)
export const getSuiteTests = async (suiteId) => request(`/suites/${suiteId}/tests/`)

  // executeSuite (suiteId, options, callback) {
  //   // Sort out options and callback
  //   if (typeof options === 'function') {
  //     callback = options
  //     options = {}
  //   }
  //   // Execute API call
  //   this.request(`/suites/${suiteId}/execute/`, options, (err, data) => {
  //     let passing
  //     if (err) {
  //       if (typeof callback === 'function') { callback(err) }
  //       return
  //     }
  //     // Check test results, determine overall pass/fail
  //     if (data instanceof Array) {
  //       passing = true
  //       for (let test of data) {
  //         passing = passing && test.passing
  //       }
  //     } else {
  //       passing = null
  //     }
  //     // Call back with extra pass/fail parameter
  //     if (typeof callback === 'function') { callback(null, data, passing) }
  //   })
  // }
