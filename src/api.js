const BASE = 'http://localhost:3000/api'

const token = () => localStorage.getItem('token') || ''

const headers = (isJson = true) => ({
  ...(isJson ? { 'Content-Type': 'application/json' } : {}),
  Authorization: `Bearer ${token()}`,
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// ── AUTH ──
export const apiSignup = (body) =>
  fetch(`${BASE}/signup`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiLogin = (body) =>
  fetch(`${BASE}/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

// ── EVENTS ──
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

// ── REGISTRATIONS ──
export const apiRegister = (eventId) =>
  fetch(`${BASE}/registrations`, { method: 'POST', headers: headers(), body: JSON.stringify({ eventId }) }).then(handle)

export const apiCancelRegistration = (eventId) =>
  fetch(`${BASE}/registrations/${eventId}`, { method: 'DELETE', headers: headers() }).then(handle)

export const apiMyRegistrations = () =>
  fetch(`${BASE}/registrations/mine`, { headers: headers() }).then(handle)

export const apiEventRegistrations = (eventId) =>
  fetch(`${BASE}/registrations/event/${eventId}`, { headers: headers() }).then(handle)

// ── FEEDBACK ──
export const apiSubmitFeedback = (body) =>
  fetch(`${BASE}/feedback`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiGetFeedback = () =>
  fetch(`${BASE}/feedback`, { headers: headers() }).then(handle)

export const apiMyFeedback = () =>
  fetch(`${BASE}/feedback/mine`, { headers: headers() }).then(handle)

// ── ADMIN ──
export const apiGetUsers = () =>
  fetch(`${BASE}/admin/users`, { headers: headers() }).then(handle)

export const apiDeleteUser = (id) =>
  fetch(`${BASE}/admin/users/${id}`, { method: 'DELETE', headers: headers() }).then(handle)

export const apiGetStats = () =>
  fetch(`${BASE}/admin/stats`, { headers: headers() }).then(handle)

export const apiUpdateProfile = (body) =>
  fetch(`${BASE}/auth/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiGetPendingEvents = () =>
  fetch(`${BASE}/events/pending`, { headers: headers() }).then(handle)

export const apiApproveEvent = (id) =>
  fetch(`${BASE}/events/${id}/approve`, { method: 'PATCH', headers: headers() }).then(handle)

export const apiRejectEvent = (id) =>
  fetch(`${BASE}/events/${id}/reject`, { method: 'PATCH', headers: headers() }).then(handle)