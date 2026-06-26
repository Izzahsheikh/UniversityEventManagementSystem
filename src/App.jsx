import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  )
}




export default App
