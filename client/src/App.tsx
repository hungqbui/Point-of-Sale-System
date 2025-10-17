import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import { ShoppingCartProvider } from './contexts/ShoppingCart'
import { ToasterProvider } from './contexts/ToastContext.tsx'
import WelcomePage from './pages/WelcomePageDD' 
import Login from './pages/Login.tsx';
import Employee_Manager from './pages/Employee_Manager.tsx';
import Menu from './pages/Menu.tsx';
import Checkout from './pages/Checkout.tsx';

function App() {
  
  return (
    <> 
      <ShoppingCartProvider>
        <ToasterProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/employee_manager" element={<Employee_Manager />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </BrowserRouter>
        </ToasterProvider>
      </ShoppingCartProvider>
    </>
  )
}

export default App
