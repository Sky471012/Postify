import React from 'react'
import { BrowserRouter ,Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import { UserProvider } from './context/UserContext';
import LinkedInRedirect from './Routes/LinkedInRedirect'
import Dashboard from './pages/Dashboard'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/linkedin-redirect" element={<LinkedInRedirect />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}
