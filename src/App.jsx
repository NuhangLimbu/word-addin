import React, { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('auto-fill')

  const tabs = [
    { id: 'auto-fill', label: '📝 Auto-fill', component: <AutoFill /> },
    { id: 'summarize', label: '📋 Summarize', component: <Summarize /> },
    { id: 'auto-correct', label: '✨ Auto-correct', component: <AutoCorrect /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="p-6 border-b bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Word Automate</h1>
              <p className="text-gray-500">Auto-fill • Summarize • Auto-correct</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
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
        <main className="bg-white m-6 rounded-lg shadow p-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-gray-500 text-sm border-t bg-white">
          <p>Word Automate v1.0 • All processing happens locally</p>
        </footer>
      </div>
    </div>
  )
}

// ================= COMPONENTS =================

// 1. AUTO-FILL COMPONENT
function AutoFill() {
  const [jsonInput, setJsonInput] = useState(`{
  "name": "John Doe",
  "date": "2024-01-15",
  "company": "Acme Inc",
  "amount": "$5,000"
}`)
  const [status, setStatus] = useState('')

  const handleAutoFill = async () => {
    try {
      await Word.run(async (context) => {
        const body = context.document.body
        const search = body.search('{{(.*?)}}', { matchWildcards: true })
        context.load(search, 'text')
        await context.sync()

        const data = JSON.parse(jsonInput)

        for (let i = 0; i < search.items.length; i++) {
          const item = search.items[i]
          const match = item.text.match(/{{(.*?)}}/)
          if (match) {
            const key = match[1].trim()
            if (data[key]) {
              item.insertText(data[key], 'Replace')
            }
          }
        }

        await context.sync()
        setStatus('✅ Template auto-filled successfully!')
      })
    } catch (error) {
      console.error(error)
      setStatus('❌ Error: Check JSON or use {{placeholders}} in document')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Auto-fill Template</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">JSON Data</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
          spellCheck="false"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Example Template:</h3>
        <code className="text-sm text-gray-600 block whitespace-pre">
{`Dear {{name}},

Invoice date: {{date}}
Company: {{company}}
Amount: {{amount}}

Thank you!`}
        </code>
      </div>

      <button
        onClick={handleAutoFill}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
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

// 2. SUMMARIZE COMPONENT
function Summarize() {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('selection')

  const handleSummarize = async () => {
    setIsLoading(true)
    try {
      await Word.run(async (context) => {
        let text = ''
        
        if (mode === 'selection') {
          const selection = context.document.getSelection()
          selection.load('text')
          await context.sync()
          text = selection.text
        } else {
          const body = context.document.body
          body.load('text')
          await context.sync()
          text = body.text
        }

        // Simple summary: first 3 sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim())
        const result = sentences.slice(0, 3).map(s => s.trim() + '.').join(' ')
        
        setSummary(result || 'No text found')
      })
    } catch (error) {
      setSummary('Error: Could not access document')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Summarize Content</h2>

      <div className="flex space-x-4">
        <button
          onClick={() => setMode('selection')}
          className={`flex-1 py-3 rounded-lg border ${mode === 'selection' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}
        >
          Selected Text
        </button>
        <button
          onClick={() => setMode('document')}
          className={`flex-1 py-3 rounded-lg border ${mode === 'document' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}
        >
          Entire Document
        </button>
      </div>

      <button
        onClick={handleSummarize}
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Summarizing...' : 'Generate Summary'}
      </button>

      {summary && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Summary:</h3>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-700">{summary}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(summary)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  )
}

// 3. AUTO-CORRECT COMPONENT
function AutoCorrect() {
  const [enabled, setEnabled] = useState(true)
  const [status, setStatus] = useState('')

  const rules = [
    { find: "dont", replace: "don't" },
    { find: "cant", replace: "can't" },
    { find: "wont", replace: "won't" },
    { find: "im", replace: "I'm" },
    { find: " alot ", replace: " a lot " },
    { find: " recieve ", replace: " receive " },
    { find: " teh ", replace: " the " },
  ]

  const handleAutoCorrect = async () => {
    if (!enabled) {
      setStatus('Please enable auto-correct first')
      return
    }

    try {
      await Word.run(async (context) => {
        const body = context.document.body
        let changes = 0

        for (const rule of rules) {
          const search = body.search(rule.find, { matchCase: false })
          context.load(search, 'text')
          await context.sync()

          if (search.items.length > 0) {
            changes += search.items.length
            for (let i = 0; i < search.items.length; i++) {
              search.items[i].insertText(rule.replace, 'Replace')
            }
          }
        }

        await context.sync()
        setStatus(changes > 0 ? `✅ Fixed ${changes} errors` : '✅ No errors found')
      })
    } catch (error) {
      setStatus('❌ Error applying corrections')
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Auto-correct</h2>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-700">Enable Auto-correct</h3>
          <p className="text-sm text-gray-500">Toggle to enable/disable all rules</p>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`w-12 h-6 rounded-full ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transform ${enabled ? 'translate-x-7' : 'translate-x-1'} transition-transform`} />
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-700">Active Rules:</h3>
        {rules.map((rule, i) => (
          <div key={i} className="flex items-center p-3 bg-white border rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <code className="bg-red-100 text-red-700 px-2 py-1 rounded mr-2">{rule.find}</code>
            <span className="mr-2">→</span>
            <code className="bg-green-100 text-green-700 px-2 py-1 rounded">{rule.replace}</code>
          </div>
        ))}
      </div>

      <button
        onClick={handleAutoCorrect}
        disabled={!enabled}
        className={`w-full py-3 font-medium rounded-lg ${enabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500'}`}
      >
        Apply Auto-corrections
      </button>

      {status && (
        <div className={`p-3 rounded-lg ${status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status}
        </div>
      )}
    </div>
  )
}

export default App