import React, { useState } from 'react'

// ========== GEMINI AI CONFIG ==========
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// ========== TEST BUTTON (MUST BE BEFORE App COMPONENT) ==========
function TestOfficeButton() {
  const [isTesting, setIsTesting] = useState(false)

  const testOffice = async () => {
    if (!window.Office) {
      alert('❌ Office.js not loaded. Are you in Microsoft Word?')
      return
    }
    
    if (!window.Word) {
      alert('❌ Word API not available. Make sure you have a document open.')
      return
    }
    
    setIsTesting(true)
    
    try {
      await Word.run(async (context) => {
        const doc = context.document
        doc.load('title')
        
        const selection = context.document.getSelection()
        selection.load('text')
        
        await context.sync()
        
        const wordCount = selection.text.split(/\s+/).filter(w => w.length > 0).length
        
        alert(`✅ Word API Connection Successful!

📄 Document: ${doc.title || 'Untitled'}
🔤 Selected Text: ${wordCount} words
📏 Characters: ${selection.text.length}
💻 Platform: Microsoft Word

Your add-in is ready to use AI features!`)
      })
    } catch (error) {
      alert(`❌ Connection Failed: ${error.message}

Troubleshooting:
1. Make sure you're in Microsoft Word
2. Open a document (not blank)
3. Allow add-in permissions
4. Try refreshing the add-in pane`)
    } finally {
      setIsTesting(false)
    }
  }
  
  return (
    <button 
      onClick={testOffice}
      disabled={isTesting}
      className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
    >
      {isTesting ? 'Testing...' : '🔧 Test Word Connection'}
    </button>
  )
}

// ========== API KEY INPUT COMPONENT ==========
function ApiKeyInput({ apiKey, saveApiKey }) {
  const [showKey, setShowKey] = useState(false)
  const [tempKey, setTempKey] = useState(apiKey || '')

  const handleSave = () => {
    if (!tempKey.trim()) {
      alert('Please enter an API key')
      return
    }
    
    if (!tempKey.startsWith('AIza')) {
      if (!confirm('This does not look like a Gemini API key (should start with "AIza"). Continue anyway?')) {
        return
      }
    }
    
    saveApiKey(tempKey)
    alert('✅ API Key saved locally in your browser!')
  }

  const handleGetKey = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank')
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={tempKey}
          onChange={(e) => setTempKey(e.target.value)}
          placeholder="Enter Gemini API Key"
          className="px-3 py-2 border rounded text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          title={showKey ? 'Hide key' : 'Show key'}
        >
          {showKey ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      <button
        onClick={handleSave}
        className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
      >
        Save Key
      </button>
      <button
        onClick={handleGetKey}
        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        title="Get free API key from Google"
      >
        Get Key
      </button>
    </div>
  )
}

// ========== GEMINI AI HELPER ==========
async function callGeminiAI(apiKey, prompt, text) {
  if (!apiKey) {
    throw new Error('Please enter your Gemini API Key above')
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${prompt}\n\nText: "${text.substring(0, 10000)}"\n\nOutput:`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    })
  })

  const data = await response.json()
  
  if (!response.ok) {
    const errorMsg = data.error?.message || 'Gemini API error'
    
    if (errorMsg.includes('API key')) {
      throw new Error('Invalid API key. Please check and save again.')
    } else if (errorMsg.includes('quota')) {
      throw new Error('API quota exceeded. Try again later or check billing.')
    } else {
      throw new Error(`API error: ${errorMsg}`)
    }
  }

  if (!data.candidates || !data.candidates[0]) {
    throw new Error('No response from AI')
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
      alert('❌ Please open this add-in in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your Gemini API Key in the header above')
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

        const prompt = `Summarize this text in ${length === 'short' ? '1-2 sentences' : length === 'medium' ? '3-4 sentences' : 'a paragraph'}. Be accurate and focus on key points.`
        
        const aiSummary = await callGeminiAI(apiKey, prompt, text)
        
        setSummary(`📝 **AI Summary**:\n\n${aiSummary}`)
      })
    } catch (error) {
      setSummary(`❌ ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🤖 AI Summarize</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('selection')}
            className={`py-3 rounded-lg border ${mode === 'selection' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Selected Text
          </button>
          <button
            onClick={() => setMode('document')}
            className={`py-3 rounded-lg border ${mode === 'document' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Entire Document
          </button>
        </div>

        <div className="flex space-x-2">
          {['short', 'medium', 'long'].map((opt) => (
            <button
              key={opt}
              onClick={() => setLength(opt)}
              className={`px-3 py-2 rounded ${length === opt 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={handleAISummarize}
          disabled={isLoading || !apiKey}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Summarizing...' : 'Generate Summary'}
        </button>

        {summary && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <pre className="whitespace-pre-wrap">{summary}</pre>
          </div>
        )}
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
      alert('❌ Please open this add-in in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your Gemini API Key in the header above')
      return
    }

    setIsLoading(true)
    setStatus('Analyzing...')

    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection()
        selection.load('text')
        await context.sync()
        
        const text = selection.text.trim()

        if (!text) {
          setStatus('⚠️ Please select text')
          return
        }

        const prompts = {
          grammar: `Fix grammar and spelling. Return ONLY corrected text.`,
          tone: `Improve tone to be more professional. Return ONLY improved text.`,
          concise: `Make more concise. Return ONLY concise text.`,
          formal: `Make more formal. Return ONLY formal text.`
        }

        const prompt = prompts[correctionType]
        const correctedText = await callGeminiAI(apiKey, prompt, text)

        selection.insertText(correctedText, 'Replace')
        await context.sync()
        
        setStatus(`✅ ${correctionType} correction applied!`)
      })
    } catch (error) {
      setStatus(`❌ ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">✨ AI Auto-correct</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {['grammar', 'tone', 'concise', 'formal'].map((type) => (
            <button
              key={type}
              onClick={() => setCorrectionType(type)}
              className={`p-3 rounded-lg border ${correctionType === type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="font-medium">{type}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleAICorrect}
          disabled={isLoading || !apiKey}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Apply Correction'}
        </button>

        {status && (
          <div className={`p-3 rounded-lg ${status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  )
}

// ========== AUTO-FILL COMPONENT ==========
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
      setStatus('❌ Please open in Microsoft Word')
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

// ========== MAIN APP COMPONENT (MUST BE LAST) ==========
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
        <header className="p-6 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Word AI Automate</h1>
                <p className="text-gray-500">AI-Powered Document Tools</p>
              </div>
            </div>
            <ApiKeyInput apiKey={apiKey} saveApiKey={saveApiKey} />
          </div>
          <TestOfficeButton />
        </header>

        <div className="px-6 pt-6">
          <div className="flex border-b">
            {['auto-fill', 'summarize', 'auto-correct'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm ${activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab === 'auto-fill' ? '📝 Auto-fill' : 
                 tab === 'summarize' ? '🤖 Summarize' : '✨ Auto-correct'}
              </button>
            ))}
          </div>
        </div>

        <main className="bg-white m-6 rounded-lg shadow p-6">
          {activeTab === 'auto-fill' && <AutoFill />}
          {activeTab === 'summarize' && <SummarizeAI apiKey={apiKey} />}
          {activeTab === 'auto-correct' && <AutoCorrectAI apiKey={apiKey} />}
        </main>

        <footer className="p-6 text-center text-gray-500 text-sm">
          <p>Word AI Automate • All processing happens locally</p>
        </footer>
      </div>
    </div>
  )
}

export default App