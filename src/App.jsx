import React, { useState } from 'react'

// ========== GEMINI AI CONFIG ==========
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// ========== SIMPLE TEST BUTTON ==========
function TestOfficeButton() {
  const testOffice = () => {
    alert('✅ Word add-in is loaded!\n\nEnter your Gemini API key above to use AI features.')
  }
  
  return (
    <button 
      onClick={testOffice}
      className="mt-4 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
    >
      Test Connection
    </button>
  )
}

// ========== SIMPLE API KEY INPUT ==========
function ApiKeyInput({ apiKey, saveApiKey }) {
  const [tempKey, setTempKey] = useState(apiKey || '')

  const handleSave = () => {
    saveApiKey(tempKey)
    alert('✅ API Key saved!')
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="password"
        value={tempKey}
        onChange={(e) => setTempKey(e.target.value)}
        placeholder="Enter Gemini API Key"
        className="px-3 py-2 border rounded text-sm w-64"
      />
      <button
        onClick={handleSave}
        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  )
}

// ========== MAIN APP ==========
function App() {
  const [activeTab, setActiveTab] = useState('auto-fill')
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')

  const saveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('gemini_api_key', key)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded">
                <span className="text-blue-600">⚡</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Word AI Automate</h1>
                <p className="text-sm text-gray-500">AI Document Tools</p>
              </div>
            </div>
            <ApiKeyInput apiKey={apiKey} saveApiKey={saveApiKey} />
          </div>
          <TestOfficeButton />
        </header>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('auto-fill')}
            className={`flex-1 py-3 ${activeTab === 'auto-fill' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            📝 Auto-fill
          </button>
          <button
            onClick={() => setActiveTab('summarize')}
            className={`flex-1 py-3 ${activeTab === 'summarize' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            🤖 Summarize
          </button>
          <button
            onClick={() => setActiveTab('auto-correct')}
            className={`flex-1 py-3 ${activeTab === 'auto-correct' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            ✨ Auto-correct
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-white">
          {activeTab === 'auto-fill' && (
            <div>
              <h2 className="text-lg font-bold mb-4">Auto-fill Template</h2>
              <p>Paste JSON to fill {{placeholders}} in your document</p>
            </div>
          )}
          
          {activeTab === 'summarize' && (
            <div>
              <h2 className="text-lg font-bold mb-4">AI Summarize</h2>
              <p>Enter Gemini API key above to use this feature</p>
            </div>
          )}
          
          {activeTab === 'auto-correct' && (
            <div>
              <h2 className="text-lg font-bold mb-4">AI Auto-correct</h2>
              <p>Enter Gemini API key above to use this feature</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-gray-500 text-sm border-t">
          <p>Word AI Automate • Get API key from Google AI Studio</p>
        </div>
      </div>
    </div>
  )
}

export default App