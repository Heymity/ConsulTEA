import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
