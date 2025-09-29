import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import './index.css'

function App() {
  return (
    <div className='w-screen min-h-screen bg-[#000814] flex flex-col '>
      <Routes>
      <Route path='/' element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App
