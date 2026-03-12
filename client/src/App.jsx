import React from 'react'
import {Routes, Route} from "react-router-dom"
import Layout from './components/layout'

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Layout />} />
      </Routes>
    </div>
  )
}

export default App