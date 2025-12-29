import React, { useState } from 'react'

// ========== GEMINI AI CONFIG ==========
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

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
        <header className="p-6 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Word AI Automate</h1>
                <p className="text-gray-500">AI-Powered Auto-fill • Summarize • Auto-correct</p>
              </div>
            </div>
            <ApiKeyInput apiKey={apiKey} saveApiKey={saveApiKey} />
          </div>
          <TestOfficeButton />
        </header>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex border-b">
            {[
              { id: 'auto-fill', label: '📝 Auto-fill' },
              { id: 'summarize', label: '🤖 AI Summarize' },
              { id: 'auto-correct', label: '✨ AI Auto-correct' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm ${activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="bg-white m-6 rounded-lg shadow p-6 min-h-[400px]">
          {activeTab === 'auto-fill' && <AutoFill />}
          {activeTab === 'summarize' && <SummarizeAI apiKey={apiKey} />}
          {activeTab === 'auto-correct' && <AutoCorrectAI apiKey={apiKey} />}
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-gray-500 text-sm border-t bg-white">
          <p>Word AI Automate v2.0 • Powered by Gemini Flash 2.0</p>
          <p className="mt-1">Get API key: <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-blue-600">Google AI Studio</a></p>
        </footer>
      </div>
    </div>
  )
}

// ========== API KEY INPUT ==========
function ApiKeyInput({ apiKey, saveApiKey }) {
  const [showKey, setShowKey] = useState(false)
  const [tempKey, setTempKey] = useState(apiKey)

  const handleSave = () => {
    saveApiKey(tempKey)
    alert('API Key saved locally!')
  }

  return (
    <div className="relative">
      <input
        type={showKey ? 'text' : 'password'}
        value={tempKey}
        onChange={(e) => setTempKey(e.target.value)}
        placeholder="Gemini API Key"
        className="px-3 py-1 border rounded text-sm w-48"
      />
      <button
        onClick={() => setShowKey(!showKey)}
        className="absolute right-12 top-1 text-gray-500"
      >
        {showKey ? '👁️' : '👁️‍🗨️'}
      </button>
      <button
        onClick={handleSave}
        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  )
}

// ========== GEMINI AI HELPER ==========
async function callGeminiAI(apiKey, prompt, text) {
  if (!apiKey) {
    throw new Error('Please enter your Gemini API Key in the header')
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${prompt}\n\nText: "${text}"\n\nOutput:`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    })
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gemini API error')
  }

  return data.candidates[0].content.parts[0].text.trim()
}

// ========== AI SUMMARIZE COMPONENT ==========
function SummarizeAI({ apiKey }) {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('selection')
  const [length, setLength] = useState('medium')

  const handleAISummarize = async () => {
    if (!window.Word) {
      alert('❌ Please open in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your Gemini API Key in the header')
      return
    }

    setIsLoading(true)
    setSummary('')

    try {
      await Word.run(async (context) => {
        let text = ''

        if (mode === 'selection') {
          const selection = context.document.getSelection()
          selection.load('text')
          await context.sync()
          text = selection.text.trim()
        } else {
          const body = context.document.body
          body.load('text')
          await context.sync()
          text = body.text.trim()
        }

        if (!text) {
          setSummary('⚠️ No text found. Please select text or open a document.')
          return
        }

        if (text.length < 50) {
          setSummary('⚠️ Text is too short. Need at least 50 characters for AI summary.')
          return
        }

        // Create AI prompt based on selected length
        const lengthPrompts = {
          short: 'Summarize in 1-2 short sentences (concise)',
          medium: 'Summarize in 3-4 sentences (standard)',
          long: 'Summarize in a paragraph (detailed)'
        }

        const prompt = `You are an expert document summarizer. ${lengthPrompts[length]} from the given text. Focus on key points and main ideas. Be accurate and clear.`

        setSummary('🤖 AI is analyzing and summarizing...')
        
        const aiSummary = await callGeminiAI(apiKey, prompt, text.substring(0, 10000)) // Limit to 10k chars
        
        setSummary(`📝 AI Summary (${length}):\n\n${aiSummary}`)
      })
    } catch (error) {
      console.error('Error:', error)
      setSummary(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">🤖 AI-Powered Summarize</h2>
        <p className="text-gray-600">Uses Gemini Flash 2.0 to generate intelligent summaries</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('selection')}
            className={`py-3 rounded-lg border ${mode === 'selection' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Selected Text
          </button>
          <button
            onClick={() => setMode('document')}
            className={`py-3 rounded-lg border ${mode === 'document' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Entire Document
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Summary Length:</label>
          <div className="flex space-x-4">
            {['short', 'medium', 'long'].map((opt) => (
              <button
                key={opt}
                onClick={() => setLength(opt)}
                className={`px-4 py-2 rounded ${length === opt ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAISummarize}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? '🤖 AI Thinking...' : 'Generate AI Summary'}
        </button>

        {summary && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">AI Result:</h3>
              <button
                onClick={() => navigator.clipboard.writeText(summary.replace(/^📝 AI Summary.*:\n\n/, ''))}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                📋 Copy Summary
              </button>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          🚀 <strong>Powered by Gemini Flash 2.0:</strong> Advanced AI understands context, tone, and key information.
        </div>
      </div>
    </div>
  )
}

// ========== AI AUTO-CORRECT COMPONENT ==========
function AutoCorrectAI({ apiKey }) {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [correctionType, setCorrectionType] = useState('grammar')

  const handleAICorrect = async () => {
    if (!window.Word) {
      alert('❌ Please open in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your Gemini API Key in the header')
      return
    }

    setIsLoading(true)
    setStatus('🤖 AI is analyzing your document...')

    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection()
        selection.load('text')
        await context.sync()
        
        const text = selection.text.trim()

        if (!text) {
          setStatus('⚠️ Please select some text to correct')
          return
        }

        if (text.length < 20) {
          setStatus('⚠️ Please select more text (at least 20 characters)')
          return
        }

        // AI prompts for different correction types
        const prompts = {
          grammar: `Fix all grammar, punctuation, and spelling errors in this text. Return ONLY the corrected version with no explanations. Preserve the original meaning and formatting.`,
          tone: `Improve the tone of this text to make it more professional and polished. Return ONLY the improved version with no explanations.`,
          concise: `Make this text more concise and clear while keeping all key information. Return ONLY the concise version with no explanations.`,
          formal: `Make this text more formal for business/professional use. Return ONLY the formal version with no explanations.`
        }

        const prompt = prompts[correctionType]
        
        const correctedText = await callGeminiAI(apiKey, prompt, text.substring(0, 5000)) // Limit chars

        // Replace the selected text with AI-corrected version
        selection.insertText(correctedText, 'Replace')
        await context.sync()
        
        setStatus(`✅ AI ${correctionType} correction applied!`)
      })
    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const correctionTypes = [
    { id: 'grammar', label: 'Grammar & Spelling', desc: 'Fix errors and typos' },
    { id: 'tone', label: 'Improve Tone', desc: 'Make more professional' },
    { id: 'concise', label: 'Make Concise', desc: 'Remove wordiness' },
    { id: 'formal', label: 'Make Formal', desc: 'Business/professional' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">✨ AI Auto-correct</h2>
        <p className="text-gray-600">Gemini Flash 2.0 intelligently improves your writing</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {correctionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setCorrectionType(type.id)}
              className={`p-4 rounded-lg border text-left ${correctionType === type.id
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="font-medium text-gray-800">{type.label}</div>
              <div className="text-sm text-gray-500">{type.desc}</div>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">How to use:</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal pl-4">
            <li>Select text in your Word document</li>
            <li>Choose correction type above</li>
            <li>Click "Apply AI Correction"</li>
            <li>AI will replace selected text with improved version</li>
          </ol>
        </div>

        <button
          onClick={handleAICorrect}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? '🤖 AI Processing...' : 'Apply AI Correction'}
        </button>

        {status && (
          <div className={`p-3 rounded-lg ${status.includes('✅') ? 'bg-green-50 text-green-700' : status.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {status}
          </div>
        )}

        <div className="text-sm text-gray-500 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
          🌟 <strong>AI Magic:</strong> Gemini understands context, style, and nuance for human-like corrections.
        </div>
      </div>
    </div>
  )
}

// ========== AUTO-FILL COMPONENT (SAME AS BEFORE) ==========
function AutoFill() {
  const [jsonInput, setJsonInput] = useState(`{
  "name": "John Doe",
  "date": "2024-01-15",
  "company": "Acme Inc",
  "amount": "$5,000"
}`)
  const [status, setStatus] = useState('')

  const handleAutoFill = async () => {
    if (!window.Word) {
      setStatus('❌ Please open in Microsoft Word with a document')
      return
    }
    
    try {
      const data = JSON.parse(jsonInput)
      
      await Word.run(async (context) => {
        const body = context.document.body
        let changes = 0
        
        for (const [key, value] of Object.entries(data)) {
          const placeholder = `{{${key}}}`
          const search = body.search(placeholder, { matchCase: false })
          context.load(search, 'text')
          await context.sync()
          
          if (search.items.length > 0) {
            changes += search.items.length
            for (let i = 0; i < search.items.length; i++) {
              search.items[i].insertText(String(value), 'Replace')
            }
          }
        }
        
        await context.sync()
        
        if (changes > 0) {
          setStatus(`✅ Replaced ${changes} placeholders`)
        } else {
          setStatus('ℹ️ No {{placeholders}} found')
        }
      })
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Auto-fill Template</h2>
      
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="w-full h-48 p-3 border rounded-lg font-mono text-sm"
        spellCheck="false"
      />
      
      <button
        onClick={handleAutoFill}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Auto-fill Document
      </button>
      
      {status && (
        <div className={`p-3 rounded-lg ${status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status}
        </div>
      )}
    </div>
  )
}

// ========== TEST BUTTON ==========
function TestOfficeButton() {
  const testOffice = async () => {
    if (!window.Office) {
      alert('❌ Office.js not loaded')
      return
    }
    
    try {
      await Word.run(async (context) => {
        const doc = context.document
        doc.load('title')
        await context.sync()
        alert(`✅ Word API working!\nDocument: ${doc.title || 'Untitled'}`)
      })
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }
  
  return (
    <button 
      onClick={testOffice}
      className="mt-4 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
    >
      Test Office Connection
    </button>
  )
}

export default App