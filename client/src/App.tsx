import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import Login from './pages/Login'

import Menu from './pages/Menu';
import { ShoppingCartProvider } from './contexts/ShoppingCart'
import WelcomePage from './pages/WelcomePageDD' 

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<div>Sign up page</div>} />
          <Route path="/menu" element={<div>Menu page</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
