import BASE, { headers, handle } from './httpClient.js'

export const apiGetUsers = () =>
  fetch(`${BASE}/admin/users`, { headers: headers() }).then(handle)

export const apiDeleteUser = (id) =>
  fetch(`${BASE}/admin/users/${id}`, { method: 'DELETE', headers: headers() }).then(handle)

export const apiGetStats = () =>
  fetch(`${BASE}/admin/stats`, { headers: headers() }).then(handle)