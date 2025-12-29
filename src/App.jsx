import React, { useState, useEffect } from 'react';
import WordAutomater from './components/WordAutomater';
import Dashboard from './components/Dashboard';
import WaveBackground from './components/WaveBackground';
import { 
  Word, 
  Zap, 
  Brain, 
  FileText, 
  Settings, 
  BarChart3, 
  History,
  CheckCircle,
  AlertCircle,
  User,
  TrendingUp,
  Bell,
  HelpCircle,
  Menu
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [wordConnected, setWordConnected] = useState(false);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize connection with Word
  useEffect(() => {
    const initializeWord = async () => {
      try {
        setLoading(true);
        
        // Wait for Office.js to load
        if (typeof Office !== 'undefined') {
          await Office.onReady();
          setWordConnected(true);
          
          // Get document info if Word is available
          if (typeof Word !== 'undefined') {
            try {
              await Word.run(async (context) => {
                const doc = context.document;
                context.load(doc, 'title');
                await context.sync();
                
                // Get word count
                const body = context.document.body;
                const range = body.getRange('Whole');
                range.load('text');
                await context.sync();
                
                const text = range.text;
                const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
                
                setDocumentInfo({
                  title: doc.title || 'Untitled Document',
                  wordCount: wordCount
                });
              });
            } catch (wordError) {
              console.log('Word document not accessible:', wordError);
              setDocumentInfo({
                title: 'No document open',
                wordCount: 0
              });
            }
          }
        } else {
          console.log('Office.js not loaded - running in mock mode');
          // Mock connection for development
          setTimeout(() => {
            setWordConnected(true);
            setDocumentInfo({
              title: 'Mock Document.docx',
              wordCount: 1250
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setWordConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeWord();
  }, []);

  // Function to test Office.js functionality
  const testOfficeConnection = async () => {
    if (typeof Word !== 'undefined') {
      try {
        await Word.run(async (context) => {
          const range = context.document.getSelection();
          range.load('text');
          await context.sync();
          alert(`Selected text: ${range.text || 'No text selected'}`);
        });
      } catch (error) {
        alert('Error accessing Word: ' + error.message);
      }
    } else {
      alert('Word object not available. Running in mock mode.');
    }
  };

  // Quick action buttons
  const quickActions = [
    {
      id: 1,
      label: 'Auto-Correct',
      icon: Zap,
      color: 'cyan',
      onClick: async () => {
        if (wordConnected) {
          alert('Auto-correcting document...');
        }
      }
    },
    {
      id: 2,
      label: 'AI Summarize',
      icon: Brain,
      color: 'purple',
      onClick: async () => {
        if (wordConnected) {
          alert('Generating AI summary...');
        }
      }
    },
    {
      id: 3,
      label: 'Apply Template',
      icon: FileText,
      color: 'green',
      onClick: async () => {
        if (wordConnected) {
          alert('Applying template...');
        }
      }
    },
    {
      id: 4,
      label: 'Export',
      icon: History,
      color: 'orange',
      onClick: async () => {
        if (wordConnected) {
          alert('Exporting document...');
        }
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Word Automater...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to Microsoft Word</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <WaveBackground />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Word className="w-8 h-8" />
                </div>
                <div className={`absolute -top-1 -right-1 w-6 h-6 ${wordConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full border-4 border-gray-900 flex items-center justify-center`}>
                  <div className={`w-2 h-2 bg-white rounded-full ${wordConnected ? 'animate-ping' : ''}`} />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Word Automater Pro
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${wordConnected 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {wordConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected to Word</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Disconnected</span>
                      </>
                    )}
                  </div>
                  
                  {documentInfo && (
                    <div className="px-3 py-1 bg-blue-500/20 rounded-full text-sm border border-blue-500/30">
                      📄 {documentInfo.title} • {documentInfo.wordCount} words
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and User Menu */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">1.2K</div>
                <div className="text-sm text-gray-400">Corrections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">89</div>
                <div className="text-sm text-gray-400">Summaries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">42</div>
                <div className="text-sm text-gray-400">Templates</div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-700/50 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-700/50 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-2 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-2 border border-gray-700/50">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${activeTab === 'editor' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                : 'hover:bg-gray-700/50'}`}
            >
              <FileText className="w-5 h-5" />
              Word Editor
            </button>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/10' 
                : 'hover:bg-gray-700/50'}`}
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${activeTab === 'settings' 
                ? 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 border border-emerald-500/50' 
                : 'hover:bg-gray-700/50'}`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 min-h-[600px]">
          {activeTab === 'editor' ? (
            <WordAutomater />
          ) : activeTab === 'dashboard' ? (
            <Dashboard />
          ) : (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Settings className="text-emerald-400" />
                Settings
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Settings */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4">Word Connection</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Auto-connect to Word</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                    
                    <button
                      onClick={testOfficeConnection}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
                    >
                      Test Word Connection
                    </button>
                  </div>
                </div>

                {/* AI Settings */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4">AI Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">AI Provider</label>
                      <select className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                        <option>OpenAI GPT-4</option>
                        <option>Azure OpenAI</option>
                        <option>Google Gemini</option>
                        <option>Anthropic Claude</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <input 
                        type="password" 
                        placeholder="Enter your API key"
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Settings */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4">Template Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Auto-save templates</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Show template preview</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <select className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                        <option>Dark</option>
                        <option>Light</option>
                        <option>Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Animation Level</label>
                      <select className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                        <option>Full</option>
                        <option>Minimal</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Quick Actions Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-4 bg-gradient-to-r from-${action.color}-500/10 to-${action.color}-600/10 rounded-xl border border-${action.color}-500/30 hover:border-${action.color}-400 transition-all hover:scale-105 group flex flex-col items-center justify-center gap-3`}
            >
              <div className={`p-3 bg-${action.color}-500/20 rounded-lg`}>
                <action.icon className={`w-6 h-6 text-${action.color}-400`} />
              </div>
              <span className="font-semibold text-sm">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden fixed bottom-6 right-6">
          <button className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;git add .