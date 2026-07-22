import BASE, { headers, handle } from './httpClient.js'

export const apiSignup = (body) =>
  fetch(`${BASE}/signup`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiLogin = (body) =>
  fetch(`${BASE}/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const apiUpdateProfile = (body) =>
  fetch(`${BASE}/auth/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handle)