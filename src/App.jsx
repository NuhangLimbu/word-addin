import React, { useState } from 'react'

// ========== OPENAI CONFIG ==========
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
// Available models: gpt-4, gpt-4-turbo, gpt-3.5-turbo, gpt-4o, gpt-4o-mini

// ========== MAIN APP ==========
function App() {
  const [activeTab, setActiveTab] = useState('auto-fill')
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '')

  const saveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('openai_api_key', key)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-4xl mx-auto">
        {/* Header - Updated for OpenAI */}
        <header className="p-6 border-b bg-white shadow-lg rounded-b-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Word AI Automate</h1>
                <p className="text-gray-500">Powered by OpenAI ChatGPT</p>
              </div>
            </div>
            <ApiKeyInput apiKey={apiKey} saveApiKey={saveApiKey} platform="openai" />
          </div>
          <TestOfficeButton />
        </header>

        {/* Rest of your components... */}
        {/* Make sure to update SummarizeAI and AutoCorrectAI components too */}
      </div>
    </div>
  )
}

// ========== OPENAI API HELPER ==========
async function callOpenAI(apiKey, prompt, text, model = 'gpt-3.5-turbo') {
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API Key above')
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful writing assistant integrated into Microsoft Word."
          },
          {
            role: "user",
            content: `${prompt}\n\nText: "${text.substring(0, 12000)}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      const errorMsg = data.error?.message || 'OpenAI API error'
      
      if (errorMsg.includes('Invalid API key')) {
        throw new Error('Invalid OpenAI API key. Please check and save again.')
      } else if (errorMsg.includes('quota')) {
        throw new Error('API quota exceeded. Check your OpenAI billing.')
      } else if (errorMsg.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a moment.')
      } else {
        throw new Error(`OpenAI error: ${errorMsg}`)
      }
    }

    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from AI')
    }

    return data.choices[0].message.content.trim()
  } catch (error) {
    throw error
  }
}

// ========== UPDATED API KEY INPUT ==========
function ApiKeyInput({ apiKey, saveApiKey, platform = 'openai' }) {
  const [showKey, setShowKey] = useState(false)
  const [tempKey, setTempKey] = useState(apiKey || '')
  const [model, setModel] = useState('gpt-3.5-turbo')

  const handleSave = () => {
    if (!tempKey.trim()) {
      alert('⚠️ Please enter an API key')
      return
    }
    
    // OpenAI key validation (starts with sk-)
    if (platform === 'openai' && !tempKey.startsWith('sk-')) {
      if (!confirm('This does not look like an OpenAI key (should start with "sk-"). Save anyway?')) {
        return
      }
    }
    
    saveApiKey(tempKey)
    alert(`✅ ${platform.toUpperCase()} API Key saved locally in your browser!`)
  }

  const handleGetKey = () => {
    if (platform === 'openai') {
      window.open('https://platform.openai.com/api-keys', '_blank')
    } else {
      window.open('https://makersuite.google.com/app/apikey', '_blank')
    }
  }

  const openaiModels = [
    { id: 'gpt-4o', name: 'GPT-4o', desc: 'Latest, fastest, most capable' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Fast, efficient, cheaper' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', desc: 'High intelligence, 128K context' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: 'Fast, reliable, economical' }
  ]

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type={showKey ? 'text' : 'password'}
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder={platform === 'openai' ? 'Enter your OpenAI API Key (sk-...)' : 'Enter your Gemini API Key'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm hover:opacity-90"
        >
          💾 Save
        </button>
      </div>
      
      {/* OpenAI Model Selection */}
      {platform === 'openai' && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">OpenAI Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {openaiModels.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} - {m.desc}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={handleGetKey}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-sm hover:opacity-90"
        >
          🔑 Get {platform === 'openai' ? 'OpenAI' : 'Gemini'} Key
        </button>
        <button
          onClick={() => { setTempKey(''); saveApiKey(''); }}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  )
}

// ========== UPDATED SUMMARIZE FOR OPENAI ==========
function SummarizeAI({ apiKey }) {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('selection')
  const [length, setLength] = useState('medium')
  const [model, setModel] = useState('gpt-3.5-turbo')

  const handleAISummarize = async () => {
    if (!window.Word) {
      alert('❌ Please open this add-in in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your OpenAI API Key in the header above')
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

        const prompt = `Summarize the following text in ${length === 'short' ? '1-2 sentences' : length === 'medium' ? '3-4 sentences' : 'a paragraph'}. Be accurate and focus on key points.`

        setSummary('🤖 OpenAI is analyzing...')
        
        const aiSummary = await callOpenAI(apiKey, prompt, text, model)
        
        setSummary(`📝 **OpenAI Summary (${model})**:\n\n${aiSummary}`)
      })
    } catch (error) {
      console.error('Error:', error)
      setSummary(`❌ ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of SummarizeAI component
}

// ========== UPDATED AUTO-CORRECT FOR OPENAI ==========
function AutoCorrectAI({ apiKey }) {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [correctionType, setCorrectionType] = useState('grammar')
  const [model, setModel] = useState('gpt-3.5-turbo')

  const handleAICorrect = async () => {
    if (!window.Word) {
      alert('❌ Please open this add-in in Microsoft Word')
      return
    }

    if (!apiKey) {
      alert('⚠️ Please enter your OpenAI API Key in the header above')
      return
    }

    setIsLoading(true)
    setStatus('🤖 OpenAI is analyzing your text...')

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

        const prompts = {
          grammar: `Fix ALL grammar, spelling, punctuation, and capitalization errors in this text. Return ONLY the corrected version with NO explanations. Preserve the original meaning and formatting.`,
          tone: `Improve the tone of this text to be more professional, polished, and effective. Fix awkward phrasing. Return ONLY the improved version with NO explanations.`,
          concise: `Make this text more concise while keeping ALL key information. Remove redundancies and wordiness. Return ONLY the concise version with NO explanations.`,
          formal: `Make this text more formal for business or professional use. Use formal language and proper structure. Return ONLY the formal version with NO explanations.`
        }

        const prompt = prompts[correctionType]
        const correctedText = await callOpenAI(apiKey, prompt, text, model)

        selection.insertText(correctedText, 'Replace')
        await context.sync()
        
        setStatus(`✅ OpenAI ${correctionType} correction applied!`)
      })
    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of AutoCorrectAI component
}

// AutoFill component remains the same
// TestOfficeButton remains the same

export default App