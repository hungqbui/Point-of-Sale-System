import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Menu from './pages/Menu';
import { ShoppingCartProvider } from './contexts/ShoppingCart'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />

          <Route path="/menu" element={<ShoppingCartProvider><Menu /></ShoppingCartProvider>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
