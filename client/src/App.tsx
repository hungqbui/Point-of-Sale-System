import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import { ShoppingCartProvider } from './contexts/ShoppingCart'
import { ToasterProvider } from './contexts/ToastContext'

function App() {
  
  return (
    <>
      <ToasterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />

            <Route path="/menu" element={<ShoppingCartProvider><Menu /></ShoppingCartProvider>} />
          </Routes>
        </BrowserRouter>
      </ToasterProvider>
    </>
  )
}

export default App
