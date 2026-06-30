import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null')
  if (!user) return <Navigate to='/login' replace />
  if (role && user.role !== role) return <Navigate to='/login' replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/student/dashboard' element={
        <ProtectedRoute role='student'><StudentDashboard /></ProtectedRoute>
      } />
      <Route path='/organizer/dashboard' element={
        <ProtectedRoute role='organizer'><OrganizerDashboard /></ProtectedRoute>
      } />
      <Route path='/admin/dashboard' element={
        <ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>
      } />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}