import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Employee_Manager from './pages/Employee_Manager'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee_manager" element={<Employee_Manager />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
