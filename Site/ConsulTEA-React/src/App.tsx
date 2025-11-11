import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import RegisterPatient from './pages/registerPatient/RegisterPatient';
import RegisterDoctor from './pages/registerDoctor/registerDoctor';
import AutismInfoPage from './pages/AutismInfoPage/AutismInfoPage';
import SeePatients from './pages/seePatients/seePatients';
import AddAppointment from './pages/addAppointment/addApointment';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/autism-info" element={<AutismInfoPage />} />
        <Route path="/see-patients" element={<SeePatients />} />
        <Route path="/add-appointment" element={<AddAppointment />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
