import React, { useState } from 'react'

// ========== SIMPLE APP ==========
function App() {
  const [activeTab, setActiveTab] = useState('auto-fill')
  const [apiKey, setApiKey] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Word AI Automate</h1>
          <p className="text-gray-600">Document automation tools</p>
          
          <div className="mt-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Gemini API Key"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['Auto-fill', 'Summarize', 'Auto-correct'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-3 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-500' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'auto-fill' && (
            <div>
              <h2 className="text-lg font-bold mb-4">Auto-fill Template</h2>
              <p>This feature works without API key</p>
            </div>
          )}
          
          {activeTab === 'summarize' && (
            <div>
              <h2 className="text-lg font-bold mb-4">AI Summarize</h2>
              <p>Enter Gemini API key to use</p>
            </div>
          )}
          
          {activeTab === 'auto-correct' && (
            <div>
              <h2 className="text-lg font-bold mb-4">AI Auto-correct</h2>
              <p>Enter Gemini API key to use</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App