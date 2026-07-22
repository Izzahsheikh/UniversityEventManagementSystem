import BASE, { headers, handle } from './httpClient.js'

export const apiGetEvents = () =>
  fetch(`${BASE}/events`, { headers: headers() }).then(handle)

export const apiGetMyEvents = () =>
  fetch(`${BASE}/events/mine`, { headers: headers() }).then(handle)

export const apiCreateEvent = (body) =>
  fetch(`${BASE}/events`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiUpdateEvent = (id, body) =>
  fetch(`${BASE}/events/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiDeleteEvent = (id) =>
  fetch(`${BASE}/events/${id}`, { method: 'DELETE', headers: headers() }).then(handle)

export const apiGetPendingEvents = () =>
  fetch(`${BASE}/events/pending`, { headers: headers() }).then(handle)

export const apiApproveEvent = (id) =>
  fetch(`${BASE}/events/${id}/approve`, { method: 'PATCH', headers: headers() }).then(handle)

export const apiRejectEvent = (id) =>
  fetch(`${BASE}/events/${id}/reject`, { method: 'PATCH', headers: headers() }).then(handle)