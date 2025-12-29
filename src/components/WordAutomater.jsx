import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  FileText, 
  Download, 
  Copy, 
  RefreshCw, 
  Search,
  Send,
  Template
} from 'lucide-react';

const WordAutomater = () => {
  const [selectedText, setSelectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(true);
  const [autoSummarizeEnabled, setAutoSummarizeEnabled] = useState(true);
  const [summary, setSummary] = useState('');
  const [correctionLog, setCorrectionLog] = useState([]);

  const templates = [
    { id: 1, name: 'Business Report', json: { template: 'report', sections: 5 } },
    { id: 2, name: 'Meeting Minutes', json: { template: 'minutes', sections: 4 } },
    { id: 3, name: 'Email Draft', json: { template: 'email', fields: ['to', 'subject', 'body'] } },
    { id: 4, name: 'Project Proposal', json: { template: 'proposal', sections: 6 } },
  ];

  // Get selected text from Word
  const getSelection = async () => {
    try {
      await Word.run(async (context) => {
        const range = context.document.getSelection();
        range.load('text');
        await context.sync();
        setSelectedText(range.text);
      });
    } catch (error) {
      console.error('Error getting selection:', error);
    }
  };

  // Auto-correct functionality
  const handleAutoCorrect = async () => {
    if (!autoCorrectEnabled) return;
    
    setIsProcessing(true);
    try {
      await Word.run(async (context) => {
        const range = context.document.getSelection();
        
        // Common corrections
        const corrections = [
          { from: /\bteh\b/gi, to: 'the' },
          { from: /\brecieve\b/gi, to: 'receive' },
          { from: /\bseperate\b/gi, to: 'separate' },
          { from: /\bwierd\b/gi, to: 'weird' },
          { from: /\bdefinately\b/gi, to: 'definitely' },
          { from: /\bi\b/g, to: 'I' },
          { from: /\bim\b/gi, to: 'I\'m' },
          { from: /\byour\b/gi, to: 'you\'re' },
        ];

        let correctionCount = 0;
        
        for (const correction of corrections) {
          // Search and replace in Word
          const searchResults = range.search(correction.from, { matchCase: false });
          searchResults.load('text');
          await context.sync();
          
          if (searchResults.items.length > 0) {
            correctionCount += searchResults.items.length;
            searchResults.items.forEach((result) => {
              result.insertText(correction.to, 'Replace');
            });
          }
        }

        await context.sync();
        
        if (correctionCount > 0) {
          setCorrectionLog(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            corrections: correctionCount
          }]);
        }
      });
    } catch (error) {
      console.error('Auto-correct error:', error);
    }
    setIsProcessing(false);
  };

  // AI Summarize
  const handleSummarize = async () => {
    if (!selectedText) {
      alert('Please select some text first');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing (replace with actual API call)
    setTimeout(() => {
      const sentences = selectedText.split(/[.!?]+/);
      const summaryText = sentences.slice(0, 3).join('. ') + '.';
      setSummary(summaryText);
      
      // Insert summary into Word
      Word.run(async (context) => {
        const range = context.document.getSelection();
        range.insertText(`\n\n[AI Summary]: ${summaryText}\n\n`, 'After');
        await context.sync();
      });
      
      setIsProcessing(false);
    }, 1500);
  };

  // Apply template
  const applyTemplate = (template) => {
    Word.run(async (context) => {
      const range = context.document.getSelection();
      
      let templateText = '';
      switch (template.name) {
        case 'Business Report':
          templateText = '\n\n# Executive Summary\n[Summary here]\n\n# Introduction\n[Introduction here]\n\n# Analysis\n[Analysis here]\n\n# Conclusion\n[Conclusion here]\n\n# Recommendations\n[Recommendations here]';
          break;
        case 'Meeting Minutes':
          templateText = '\n\nMeeting Minutes\nDate: [Date]\nAttendees: [List]\n\nAgenda:\n1. [Item 1]\n2. [Item 2]\n3. [Item 3]\n\nAction Items:\n- [ ] Task 1\n- [ ] Task 2';
          break;
        case 'Email Draft':
          templateText = '\n\nTo: [Recipient]\nSubject: [Subject]\n\nDear [Name],\n\n[Body]\n\nBest regards,\n[Your Name]';
          break;
        default:
          templateText = '\n\n[Template Content]';
      }
      
      range.insertText(templateText, 'After');
      await context.sync();
    });
  };

  // Export to different formats
  const exportDocument = async (format) => {
    try {
      // Word.js API for export
      const content = await getDocumentContent();
      
      // Create blob and download
      const blob = new Blob([content], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/msword' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document.${format}`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getDocumentContent = async () => {
    return new Promise((resolve) => {
      Word.run(async (context) => {
        const body = context.document.body;
        const range = body.getRange('Whole');
        range.load('text');
        await context.sync();
        resolve(range.text);
      });
    });
  };

  useEffect(() => {
    // Get initial selection
    getSelection();
    
    // Listen for selection changes
    Word.run(async (context) => {
      context.document.addHandlerAsync(Word.EventType.selectionChanged, getSelection);
      await context.sync();
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FileText className="text-cyan-400" />
            Smart Word Editor
          </h2>
          <p className="text-gray-400">AI-powered writing assistance inside Microsoft Word</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={getSelection}
            className="px-4 py-2 bg-gray-800/50 rounded-lg flex items-center gap-2 hover:bg-gray-700/50"
          >
            <Search className="w-4 h-4" />
            Get Selection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* Selected Text Preview */}
          <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Selected Text
            </h3>
            <div className="h-32 overflow-y-auto bg-gray-900/50 rounded-lg p-4">
              {selectedText ? (
                <p className="text-sm">{selectedText.substring(0, 300)}...</p>
              ) : (
                <p className="text-gray-500 italic">Select text in Word to see preview</p>
              )}
            </div>
            <div className="mt-3 text-sm text-gray-400">
              {selectedText.length} characters, {selectedText.split(/\s+/).filter(w => w).length} words
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-5 border border-cyan-500/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              AI Features
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Correct</p>
                  <p className="text-sm text-gray-400">Fix spelling as you type</p>
                </div>
                <button
                  onClick={() => setAutoCorrectEnabled(!autoCorrectEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoCorrectEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoCorrectEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Summarize</p>
                  <p className="text-sm text-gray-400">Generate AI summaries</p>
                </div>
                <button
                  onClick={() => setAutoSummarizeEnabled(!autoSummarizeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSummarizeEnabled ? 'bg-purple-500' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSummarizeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <button
                onClick={handleSummarize}
                disabled={isProcessing || !selectedText}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {isProcessing ? 'Summarizing...' : 'AI Summarize'}
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4">Export</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => exportDocument('docx')}
                className="p-3 bg-blue-500/20 rounded-lg flex flex-col items-center justify-center hover:bg-blue-500/30 transition-colors"
              >
                <FileText className="w-6 h-6 text-blue-400 mb-2" />
                <span className="text-sm">.DOCX</span>
              </button>
              <button
                onClick={() => exportDocument('pdf')}
                className="p-3 bg-red-500/20 rounded-lg flex flex-col items-center justify-center hover:bg-red-500/30 transition-colors"
              >
                <FileText className="w-6 h-6 text-red-400 mb-2" />
                <span className="text-sm">.PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Templates */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/30 rounded-2xl p-1 h-full">
            <div className="bg-gray-900/50 rounded-xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  <Template className="w-6 h-6 text-emerald-400" />
                  Templates Library
                </h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gray-800/50 rounded-lg flex items-center gap-2 hover:bg-gray-700/50">
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </button>
                  <button className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg flex items-center gap-2 hover:bg-emerald-500/30">
                    <Send className="w-4 h-4" />
                    Import Template
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-cyan-300">{template.name}</h4>
                        <p className="text-sm text-gray-400">Click to apply to document</p>
                      </div>
                      <div className="p-2 bg-gray-900/50 rounded-lg group-hover:bg-cyan-500/20">
                        <Template className="w-5 h-5 text-gray-400 group-hover:text-cyan-300" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">JSON Structure:</div>
                      <div className="font-mono text-sm bg-gray-900/70 p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(template.json, null, 2)}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="px-2 py-1 bg-gray-900/50 rounded text-gray-400">
                        {template.json.template}
                      </span>
                      <button className="text-cyan-400 hover:text-cyan-300">
                        Preview →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Correction Log */}
              {correctionLog.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-green-400" />
                    Recent Corrections
                  </h4>
                  <div className="space-y-2">
                    {correctionLog.slice(-3).map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm">{log.timestamp}</span>
                        </div>
                        <span className="text-sm text-green-400">
                          Fixed {log.corrections} errors
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Display */}
      {summary && (
        <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-300" />
              AI Summary
            </h4>
            <button
              onClick={() => setSummary('')}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <p className="text-gray-200">{summary}</p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30">
              Insert into Doc
            </button>
            <button className="px-4 py-2 bg-gray-800/50 rounded-lg text-sm hover:bg-gray-700/50">
              Copy Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordAutomater;