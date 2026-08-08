import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import Home from './pages/Home/Home.jsx'
import StudentDashboard from './pages/Student/StudentDashboard.jsx'
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'

import ChatbotWidget from './components/ChatbotWidget.jsx'
import './styles/index.css'

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null')
  if (!user) return <Navigate to='/login' replace />
  if (role && user.role !== role) return <Navigate to='/login' replace />
  return children
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
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

      <ChatbotWidget />
    </>
  )
}