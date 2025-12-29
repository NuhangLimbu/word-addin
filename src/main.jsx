import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Word AI Automate Add-in starting...')

// Function to load Office.js dynamically
const loadOfficeJs = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Office) {
      console.log('✅ Office.js already loaded')
      resolve(true)
      return
    }

    // Load Office.js from Microsoft CDN
    const script = document.createElement('script')
    script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js'
    script.type = 'text/javascript'
    
    script.onload = () => {
      console.log('✅ Office.js loaded successfully')
      resolve(true)
    }
    
    script.onerror = (error) => {
      console.warn('⚠️ Office.js failed to load:', error)
      console.log('Running in development mode (no Word integration)')
      resolve(false) // Resolve with false, don't reject
    }
    
    // Add to document head
    document.head.appendChild(script)
  })
}

// Function to initialize the app
const initializeApp = async () => {
  try {
    // Load Office.js
    const officeLoaded = await loadOfficeJs()
    
    if (officeLoaded && window.Office) {
      // Wait for Office to be ready
      Office.onReady((info) => {
        console.log(`✅ Office is ready. Host: ${info.host}, Platform: ${info.platform}`)
        
        // Check if we're in Word
        if (info.host === Office.HostType.Word) {
          console.log('📝 Running in Microsoft Word')
        } else {
          console.warn('⚠️ Running in:', info.host, '- Some features may not work')
        }
        
        // Render the app
        renderApp()
      })
    } else {
      // Office.js not available (development mode)
      console.log('🔧 Running in development mode - No Word integration')
      renderApp()
    }
  } catch (error) {
    console.error('❌ Error during initialization:', error)
    // Still render the app for debugging
    renderApp()
  }
}

// Function to render React app
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

// Start the app initialization
initializeApp()

// Development helpers
if (import.meta.env.DEV) {
  // Add mock Office.js for development
  if (!window.Office) {
    console.log('🧪 Creating mock Office.js for development')
    
    window.Office = {
      onReady: (callback) => {
        console.log('Mock Office.onReady called')
        setTimeout(() => callback({ 
          host: Office.HostType.Word || 'Word',
          platform: Office.PlatformType.PC || 'PC'
        }), 100)
      },
      context: {
        document: {
          getSelectedDataAsync: () => Promise.resolve({})
        }
      },
      HostType: {
        Word: 'Word'
      },
      PlatformType: {
        PC: 'PC',
        OfficeOnline: 'OfficeOnline'
      }
    }
    
    // Mock Word namespace for development
    if (!window.Word) {
      window.Word = {
        run: async (callback) => {
          console.log('Mock Word.run called')
          const mockContext = {
            document: {
              body: {
                search: () => ({
                  items: [],
                  load: () => {},
                  context: { sync: () => Promise.resolve() }
                }),
                load: () => {},
                text: 'Mock document text for development'
              },
              getSelection: () => ({
                load: () => {},
                text: 'Mock selected text for development',
                insertText: () => console.log('Mock insertText called')
              }),
              load: () => {},
              title: 'Mock Document'
            },
            sync: () => Promise.resolve()
          }
          await callback(mockContext)
        }
      }
    }
  }
}