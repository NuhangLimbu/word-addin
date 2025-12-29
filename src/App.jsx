import React, { useState } from 'react'

// ========== GEMINI AI CONFIG ==========
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="p-6 border-b bg-white shadow-lg rounded-b-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Word AI Automate</h1>
                <p className="text-gray-500">AI-Powered Document Automation</p>
              </div>
            </div>
            <ApiKeyInput apiKey={apiKey} saveApiKey={saveApiKey} />
          </div>
          <TestOfficeButton />
        </header>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'auto-fill', label: '📝 Auto-fill', icon: '📝' },
              { id: 'summarize', label: '🤖 AI Summarize', icon: '🤖' },
              { id: 'auto-correct', label: '✨ AI Auto-correct', icon: '✨' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="bg-white m-6 rounded-xl shadow-lg p-6 min-h-[500px] border border-gray-200">
          {activeTab === 'auto-fill' && <AutoFill />}
          {activeTab === 'summarize' && <SummarizeAI apiKey={apiKey} />}
          {activeTab === 'auto-correct' && <AutoCorrectAI apiKey={apiKey} />}
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-gray-500 text-sm border-t bg-white rounded-t-xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div>
              <p className="font-medium">Word AI Automate v2.0 • Powered by Gemini Flash 2.0</p>
              <p className="text-xs mt-1">All processing happens in your browser • No data stored</p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
              >
                Get Free API Key
              </a>
              <button 
                onClick={() => localStorage.clear()}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                Clear Data
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ========== API KEY INPUT COMPONENT ==========
function ApiKeyInput({ apiKey, saveApiKey }) {
  const [showKey, setShowKey] = useState(false)
  const [tempKey, setTempKey] = useState(apiKey || '')
  const [isValidating, setIsValidating] = useState(false)

  const validateKey = async (key) => {
    if (!key.trim()) return false
    
    try {
      // Quick validation by checking format
      if (!key.startsWith('AIza')) {
        return false
      }
      
      // Optional: Test the key with a simple API call
      const testResponse = await fetch(`${GEMINI_API_URL}?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }],
          generationConfig: { maxOutputTokens: 1 }
        })
      })
      
      return testResponse.ok
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    if (!tempKey.trim()) {
      alert('⚠️ Please enter an API key')
      return
    }

    setIsValidating(true)
    
    try {
      const isValid = await validateKey(tempKey)
      
      if (!isValid) {
        if (!confirm('This key may not be valid. It should start with "AIza". Save anyway?')) {
          return
        }
      }
      
      saveApiKey(tempKey)
      alert('✅ API Key saved successfully! It\'s stored locally in your browser.')
    } catch (error) {
      console.error('Validation error:', error)
      alert('⚠️ Could not validate key. Make sure it\'s from Google AI Studio.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGetKey = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank')
  }

  const handleClear = () => {
    setTempKey('')
    saveApiKey('')
    alert('🗑️ API Key cleared')
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type={showKey ? 'text' : 'password'}
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Enter your Gemini API Key (starts with AIza...)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isValidating}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            title={showKey ? 'Hide key' : 'Show key'}
            type="button"
          >
            {showKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isValidating}
          className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : '💾 Save'}
        </button>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleGetKey}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm hover:opacity-90"
        >
          🔑 Get Free Key
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
          title="Clear API key"
        >
          🗑️ Clear
        </button>
      </div>
      
      {apiKey && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
          ✅ Using saved API key (last 4 chars: ...{apiKey.slice(-4)})
        </div>
      )}
    </div>
  )
}

// ========== GEMINI AI HELPER ==========
async function callGeminiAI(apiKey, prompt, text) {
  if (!apiKey) {
    throw new Error('Please enter your Gemini API Key above')
  }

  // Show loading in UI
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${prompt}\n\nText: "${text.substring(0, 15000)}"\n\nOutput:`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.95,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    })
  })

  const data = await response.json()
  
  if (!response.ok) {
    const errorMsg = data.error?.message || 'Gemini API error'
    
    if (errorMsg.includes('API key')) {
      throw new Error('Invalid API key. Please check and save again.')
    } else if (errorMsg.includes('quota')) {
      throw new Error('API quota exceeded. Try again later or check billing.')
    } else if (errorMsg.includes('safety')) {
      throw new Error('Content blocked by safety filters. Try different text.')
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
  const [language, setLanguage] = useState('same')

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

        if (text.length < 20) {
          setSummary('⚠️ Text is too short. Need at least 20 characters.')
          return
        }

        // Create AI prompt
        const lengthPrompts = {
          short: 'Summarize in 1-2 short sentences. Be very concise.',
          medium: 'Summarize in 3-4 sentences. Include key points.',
          long: 'Summarize in a paragraph. Include main ideas and important details.'
        }

        const languagePrompts = {
          same: '',
          english: 'Write the summary in English.',
          simple: 'Use simple, clear language suitable for all audiences.',
          professional: 'Use formal, professional business language.'
        }

        const prompt = `You are an expert document summarizer. ${lengthPrompts[length]} ${languagePrompts[language]}
        
        Rules:
        1. Be accurate and faithful to the original
        2. Focus on key information
        3. Maintain original meaning
        4. Output only the summary, no explanations`

        setSummary('🤖 AI is analyzing... (this may take 10-20 seconds)')
        
        const aiSummary = await callGeminiAI(apiKey, prompt, text)
        
        setSummary(`📝 **AI Summary**\n\n${aiSummary}\n\n---\n*${length.charAt(0).toUpperCase() + length.slice(1)} summary • ${mode} mode*`)
      })
    } catch (error) {
      console.error('Error:', error)
      setSummary(`❌ ${error.message}\n\n💡 Tips:\n1. Check your API key is valid\n2. Ensure text isn't blocked by filters\n3. Try shorter text if large`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    const cleanSummary = summary.replace(/📝 \*\*AI Summary\*\*\n\n/, '').replace(/\n\n---\n.*/, '')
    navigator.clipboard.writeText(cleanSummary)
    alert('✅ Summary copied to clipboard!')
  }

  const handleInsert = async () => {
    if (!summary || !window.Word) return
    
    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection()
        const cleanSummary = summary.replace(/📝 \*\*AI Summary\*\*\n\n/, '').replace(/\n\n---\n.*/, '')
        selection.insertText(`\n\n[AI Summary]: ${cleanSummary}`, 'End')
        await context.sync()
        alert('✅ Summary inserted into document!')
      })
    } catch (error) {
      alert('❌ Failed to insert: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800">🤖 AI-Powered Summarization</h2>
        <p className="text-gray-600">Gemini Flash 2.0 understands context and extracts key information intelligently</p>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Summarize:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('selection')}
              className={`py-3 rounded-lg border transition-all ${mode === 'selection' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="font-medium">Selected Text</div>
              <div className="text-xs text-gray-500">Current selection only</div>
            </button>
            <button
              onClick={() => setMode('document')}
              className={`py-3 rounded-lg border transition-all ${mode === 'document' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="font-medium">Entire Document</div>
              <div className="text-xs text-gray-500">All content in document</div>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length:</label>
            <div className="flex space-x-2">
              {['short', 'medium', 'long'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setLength(opt)}
                  className={`flex-1 px-3 py-2 rounded ${length === opt 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style:</label>
            <div className="flex space-x-2">
              {['same', 'english', 'simple', 'professional'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setLanguage(opt)}
                  className={`px-3 py-2 rounded text-sm ${language === opt 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAISummarize}
          disabled={isLoading || !apiKey}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 shadow-lg transition-all"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              🤖 AI Thinking...
            </div>
          ) : (
            '✨ Generate AI Summary'
          )}
        </button>

        {/* Results */}
        {summary && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">AI Result:</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleInsert}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                >
                  📝 Insert to Doc
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-300 shadow-inner">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">{summary}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-start">
            <span className="text-xl mr-3">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Tips for best results:</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• For long documents, select key sections first</li>
                <li>• "Professional" style works best for business documents</li>
                <li>• AI understands context - don't over-simplify prompts</li>
                <li>• Free tier has rate limits - wait between requests</li>
              </ul>
            </div>
          </div>
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
      alert('❌ Please open this add-in in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your Gemini API Key in the header above')
      return
    }

    setIsLoading(true)
    setStatus('🤖 AI is analyzing your text...')

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

        if (text.length < 10) {
          setStatus('⚠️ Please select more text (at least 10 characters)')
          return
        }

        if (text.length > 5000) {
          setStatus('⚠️ Text too long. Select under 5000 characters for best results.')
          return
        }

        // AI prompts
        const prompts = {
          grammar: `Fix ALL grammar, spelling, punctuation, and capitalization errors in this text. 
          Return ONLY the corrected version with NO explanations. 
          Preserve the original meaning, tone, and formatting exactly.`,
          
          tone: `Improve the tone of this text to be more professional, polished, and effective. 
          Fix awkward phrasing. Make it sound more confident and clear.
          Return ONLY the improved version with NO explanations.`,
          
          concise: `Make this text more concise while keeping ALL key information.
          Remove redundancies, wordiness, and unnecessary phrases.
          Make every word count. Return ONLY the concise version with NO explanations.`,
          
          formal: `Make this text more formal for business, academic, or professional use.
          Use formal language, proper structure, and professional terminology.
          Return ONLY the formal version with NO explanations.`
        }

        const prompt = prompts[correctionType]
        
        setStatus('🤖 AI is processing... (10-20 seconds)')
        const correctedText = await callGeminiAI(apiKey, prompt, text)

        // Replace text
        selection.insertText(correctedText, 'Replace')
        await context.sync()
        
        setStatus(`✅ AI ${correctionType} correction applied successfully!`)
      })
    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const correctionTypes = [
    { 
      id: 'grammar', 
      label: 'Grammar & Spelling', 
      desc: 'Fix all language errors',
      icon: '🔤',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'tone', 
      label: 'Improve Tone', 
      desc: 'Make more professional',
      icon: '🎭',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'concise', 
      label: 'Make Concise', 
      desc: 'Remove wordiness',
      icon: '✂️',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'formal', 
      label: 'Make Formal', 
      desc: 'Business/professional',
      icon: '👔',
      color: 'from-gray-600 to-gray-800'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
        <h2 className="text-xl font-bold text-gray-800">✨ AI Writing Assistant</h2>
        <p className="text-gray-600">Gemini Flash 2.0 intelligently improves your writing with context awareness</p>
      </div>

      <div className="space-y-4">
        {/* Correction Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Improvement Type:</label>
          <div className="grid grid-cols-2 gap-4">
            {correctionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setCorrectionType(type.id)}
                className={`p-4 rounded-xl border text-left transition-all transform hover:scale-[1.02] ${correctionType === type.id
                    ? `border-transparent bg-gradient-to-r ${type.color} text-white shadow-lg`
                    : 'border-gray-200 bg-white hover:bg-gray-50 shadow'
                  }`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">{type.icon}</span>
                  <div>
                    <div className="font-bold">{type.label}</div>
                    <div className={`text-sm ${correctionType === type.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
                      {type.desc}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            <span className="mr-2">📋</span> How to use:
          </h3>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
            <li><strong>Select text</strong> in your Word document</li>
            <li><strong>Choose improvement type</strong> above</li>
            <li><strong>Click "Apply AI Correction"</strong> below</li>
            <li>AI will <strong>replace selected text</strong> with improved version</li>
          </ol>
          <div className="mt-3 text-xs text-gray-500">
            ⚡ Tip: Works best with paragraphs (100-1000 characters)
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAICorrect}
          disabled={isLoading || !apiKey}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 shadow-xl transition-all transform hover:scale-[1.01]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              ✨ AI is Enhancing Your Writing...
            </div>
          ) : (
            '🚀 Apply AI Correction'
          )}
        </button>

        {/* Status */}
        {status && (
          <div className={`p-4 rounded-xl border ${status.includes('✅') 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
            : status.includes('❌') 
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-red-800'
            : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              <span className="text-xl mr-3">
                {status.includes('✅') ? '✅' : status.includes('❌') ? '❌' : '🤖'}
              </span>
              <div className="font-medium">{status}</div>
            </div>
          </div>
        )}

        {/* AI Info */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-xl">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🌟</span>
            <div>
              <h4 className="font-bold text-lg">Why This AI is Special:</h4>
              <ul className="text-sm opacity-90 mt-2 space-y-1">
                <li>• <strong>Context-Aware:</strong> Understands your document's purpose</li>
                <li>• <strong>Style-Preserving:</strong> Maintains your unique voice</li>
                <li>• <strong>Human-Like:</strong> Not just grammar rules, but actual writing improvement</li>
                <li>• <strong>Fast & Efficient:</strong> Gemini Flash 2.0 is optimized for speed</li>
              </ul>
            </div>
          </div>
        </div>
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
  "amount": "$5,000",
  "email": "john@example.com",
  "project": "Website Redesign"
}`)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAutoFill = async () => {
    if (!window.Word) {
      setStatus('❌ Please open in Microsoft Word with a document')
      return
    }
    
    setIsLoading(true)
    setStatus('Processing...')
    
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
          setStatus(`✅ Successfully replaced ${changes} placeholders`)
        } else {
          setStatus('ℹ️ No {{placeholders}} found. Add template tags like {{name}} to your document.')
        }
      })
    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadExample = () => {
    setJsonInput(`{
  "client": "{{client}}",
  "invoice": "{{invoice}}",
  "date": "{{date}}",
  "due_date": "{{due_date}}",
  "amount": "{{amount}}",
  "description": "{{description}}"
}`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800">📝 Template Auto-fill</h2>
        <p className="text-gray-600">Replace {{placeholders}} in your document with JSON data</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">JSON Data:</label>
            <button
              onClick={handleLoadExample}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-48 p-4 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            spellCheck="false"
            placeholder='{"name": "Value", "date": "2024-01-01"}'
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">Example Document Template:</h3>
          <code className="text-sm text-gray-600 block whitespace-pre bg-white p-3 rounded-lg border">
{`Dear {{name}},

Invoice Date: {{date}}
Project: {{project}}
Amount Due: {{amount}}

Please remit payment to {{company}}.
Contact: {{email}}

Thank you!`}
          </code>
        </div>

        <button
          onClick={handleAutoFill}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 shadow-lg"
        >
          {isLoading ? 'Filling...' : '🚀 Auto-fill Document'}
        </button>

        {status && (
          <div className={`p-4 rounded-xl border ${status.includes('✅') 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : status.includes('❌') 
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center">
              <span className="text-xl mr-3">
                {status.includes('✅') ? '✅' : status.includes('❌') ? '❌' : 'ℹ️'}
              </span>
              <div>{status}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ========== TEST BUTTON ==========
function TestOfficeButton() {
  const [isTesting, setIsTesting] = useState(false)

  const testOffice = async () => {
    if (!window.Office) {
      alert('❌ Office.js not loaded. Are you in Microsoft Word?')
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

export default App