import { useEffect,useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Header from "../src/Component/Header.jsx"
createRoot(document.getElementById('root')).render(
  <>
    <Header />
    <App />
  </>
)
