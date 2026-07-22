import BASE, { headers, handle } from './httpClient.js'

export const apiSubmitFeedback = (body) =>
  fetch(`${BASE}/feedback`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiGetFeedback = () =>
  fetch(`${BASE}/feedback`, { headers: headers() }).then(handle)

export const apiMyFeedback = () =>
  fetch(`${BASE}/feedback/mine`, { headers: headers() }).then(handle)