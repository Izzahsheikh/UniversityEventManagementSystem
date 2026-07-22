const BASE = 'http://localhost:3000/api'

const token = () => localStorage.getItem('token') || ''

export const headers = (isJson = true) => ({
  ...(isJson ? { 'Content-Type': 'application/json' } : {}),
  Authorization: `Bearer ${token()}`,
})

export const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export default BASE