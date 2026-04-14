import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import QuienSoy from './pages/QuienSoy.jsx'
import Contacto from './pages/Contacto.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quien-soy" element={<QuienSoy />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  )
}