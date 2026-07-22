import BASE, { headers, handle } from './httpClient.js'

export const apiRegister = (eventId) =>
  fetch(`${BASE}/registrations`, { method: 'POST', headers: headers(), body: JSON.stringify({ eventId }) }).then(handle)

export const apiCancelRegistration = (eventId) =>
  fetch(`${BASE}/registrations/${eventId}`, { method: 'DELETE', headers: headers() }).then(handle)

export const apiMyRegistrations = () =>
  fetch(`${BASE}/registrations/mine`, { headers: headers() }).then(handle)

export const apiEventRegistrations = (eventId) =>
  fetch(`${BASE}/registrations/event/${eventId}`, { headers: headers() }).then(handle)