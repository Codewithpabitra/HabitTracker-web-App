import React from 'react'
import {Routes, Route} from "react-router-dom"
import Layout from './components/layout'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

import {Toaster} from "react-hot-toast"
import Dashboard from './Pages/Dashboard'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App