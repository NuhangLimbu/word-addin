import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Word AI Automate Add-in starting...')

// Load Office.js dynamically
const script = document.createElement('script')
script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js'
script.onload = () => {
  if (window.Office) {
    Office.onReady(() => {
      ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
    })
  }
}
document.head.appendChild(script)