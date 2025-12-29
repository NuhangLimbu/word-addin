import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Word AI Automate loading...')

// Simple Office.js loading
const script = document.createElement('script')
script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js'
script.onload = () => {
  if (window.Office) {
    Office.onReady(() => {
      console.log('✅ Office.js ready')
    })
  }
}
document.head.appendChild(script)

// Render app immediately
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)