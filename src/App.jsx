import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import Login from './login'
import Signup from './Signup'
import StudentDashboard from './pages/StudentDashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null')
  if (!user) return <Navigate to='/login' replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to='/login' replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/student/dashboard' element={
        <ProtectedRoute allowedRole='student'><StudentDashboard /></ProtectedRoute>
      } />
      <Route path='/organizer/dashboard' element={
        <ProtectedRoute allowedRole='organizer'><OrganizerDashboard /></ProtectedRoute>
      } />
      <Route path='/admin/dashboard' element={
        <ProtectedRoute allowedRole='admin'><AdminDashboard /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
