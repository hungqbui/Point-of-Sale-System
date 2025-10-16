import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import Login from './pages/Login'
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
