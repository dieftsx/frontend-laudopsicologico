import { BrowserRouter, Routes, Route } from "react-router-dom"
import LaudoPsicologico from "./pages/LaudoPsicologico"
import Login from "./pages/Login"
import { AuthProvider } from "./contexts/AuthContext"
import HistoricoDiagnosticos from "./pages/HistoricoDiagnosticos"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/historico" element={<HistoricoDiagnosticos />} />
          <Route path="/laudo" element={<LaudoPsicologico />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
