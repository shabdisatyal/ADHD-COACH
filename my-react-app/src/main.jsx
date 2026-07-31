import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render( //render defines what exactly to display inside render component
  
  <StrictMode>
    <App />
  </StrictMode>,
)
