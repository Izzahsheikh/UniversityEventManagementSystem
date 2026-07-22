import BASE, { headers, handle } from './httpClient.js'

export const apiSendChatMessage = (message) =>
  fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ message }),
  }).then(handle)