import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Load Office.js dynamically
const loadOffice = () => {
  return new Promise((resolve) => {
    if (window.Office) {
      resolve(true)
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js'
    script.onload = () => resolve(true)
    script.onerror = () => {
      console.log('Dev mode - Office.js not loaded')
      resolve(false)
    }
    document.head.appendChild(script)
  })
}

// Start the app
const startApp = async () => {
  await loadOffice()
  
  if (window.Office && window.Office.context) {
    Office.onReady(() => {
      ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
    })
  } else {
    // Dev mode (no Word)
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

startApp()