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
  AlertCircle
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [wordConnected, setWordConnected] = useState(false);
  const [documentInfo, setDocumentInfo] = useState(null);

  // Initialize connection with Word
  useEffect(() => {
    checkWordConnection();
  }, []);

  const checkWordConnection = async () => {
    try {
      await Office.onReady();
      setWordConnected(true);
      
      // Get current document info
      Word.run(async (context) => {
        const doc = context.document;
        context.load(doc, 'title');
        await context.sync();
        setDocumentInfo({
          title: doc.title || 'Untitled Document',
          wordCount: await getWordCount()
        });
      });
    } catch (error) {
      console.error('Word connection failed:', error);
    }
  };

  const getWordCount = async () => {
    return new Promise((resolve) => {
      Word.run(async (context) => {
        const body = context.document.body;
        const text = body.getRange('Whole');
        text.load('text');
        await context.sync();
        const words = text.text.trim().split(/\s+/).length;
        resolve(words);
      });
    });
  };

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
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
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
                      📄 {documentInfo.title}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
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
            <div className="text-center py-20">
              <Settings className="w-20 h-20 mx-auto text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Settings</h3>
              <p className="text-gray-400">Configuration options coming soon</p>
            </div>
          )}
        </main>

        {/* Quick Actions Footer */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5" />
            Quick Auto-Correct
          </button>
          
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
            <Brain className="w-5 h-5" />
            AI Summarize Selection
          </button>
          
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-semibold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
            <History className="w-5 h-5" />
            View Usage Logs
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;