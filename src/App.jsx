import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Simulator from './pages/Simulator'
import RequestCredit from './pages/RequestCredit'
import MisSolicitudes from './pages/MisSolicitudes'   // 👈 Importa el nuevo componente
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/request" element={<RequestCredit />} />
        <Route path="/mis-solicitudes" element={<MisSolicitudes />} /> {/* 👈 Nueva ruta */}
      </Routes>
    </>
  )
}

export default App