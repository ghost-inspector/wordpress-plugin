
export const request = async (path, params = {}) => {
  const { nonce, ajax_url } = window.gi_ajax
  const response = await fetch(`${ajax_url}?${new URLSearchParams(Object.entries({
    ...params,
    _ajax_nonce: nonce,
    action: 'gi_api_proxy',
    url: `https://api.ghostinspectortest.com/v1${path}`
  }))}`)
  const json = await response.json()
  if (json.code === 'SUCCESS') {
    return json.data
  } else {
    throw new Error(json.message)
  }
}

export const getSuite = async (suiteId) => request(`/suites/${suiteId}/`)
export const getSuiteTests = async (suiteId) => request(`/suites/${suiteId}/tests/`)
export const executeSuite = async (suiteId) => request(`/suites/${suiteId}/execute`, { immediate: 1 })
export const getSuiteResults = async (suiteResultId) => request(`/suite-results/${suiteResultId}/results/`)
