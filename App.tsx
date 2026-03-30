
import React, { useState, useEffect, useCallback } from 'react';
import { LogoStyle, GeneratedLogo, LogoConfig } from './types';
import { ASPECT_RATIOS } from './constants';
import { StylePicker } from './components/StylePicker';
import { LogoCard } from './components/LogoCard';
import { generateLogoImage } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<LogoConfig>({
    brandName: '',
    prompt: '',
    style: 'Minimalist',
    aspectRatio: '1:1',
    isPro: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [logos, setLogos] = useState<GeneratedLogo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load logos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('logos_gallery');
    if (saved) {
      try {
        setLogos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved logos");
      }
    }
  }, []);

  // Save logos to localStorage when gallery updates
  useEffect(() => {
    localStorage.setItem('logos_gallery', JSON.stringify(logos));
  }, [logos]);

  const handleGenerate = async () => {
    if (!config.brandName || !config.prompt) {
      setError("Please fill in both brand name and description.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // If pro model is requested, we need to check if user has selected an API key
      if (config.isPro) {
          // Check for window.aistudio.hasSelectedApiKey if applicable
          // (As per instructions, we proceed but handle key reset if required)
      }

      const imageUrl = await generateLogoImage(config);
      
      const newLogo: GeneratedLogo = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: config.prompt,
        timestamp: Date.now(),
        style: config.style
      };

      setLogos(prev => [newLogo, ...prev]);
    } catch (err: any) {
      if (err.message === "KEY_RESET_REQUIRED") {
          setError("A paid API key is required for high-quality generation. Opening selection...");
          if ((window as any).aistudio?.openSelectKey) {
              (window as any).aistudio.openSelectKey();
          }
      } else {
          setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    setLogos(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                L
              </div>
              <span className="text-xl font-bold tracking-tight">Logos<span className="text-blue-500">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Billing Info
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">
                Design your brand <span className="gradient-text">identity</span> in seconds.
              </h1>
              <p className="text-slate-400 text-lg">
                Enter your details and let Gemini generate professional logos tailored to your vision.
              </p>
            </section>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
              {/* Brand Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Brand Name</label>
                <input 
                  type="text" 
                  value={config.brandName}
                  onChange={(e) => setConfig({...config, brandName: e.target.value})}
                  placeholder="e.g. BlueBird Cafe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Describe your vision</label>
                <textarea 
                  value={config.prompt}
                  onChange={(e) => setConfig({...config, prompt: e.target.value})}
                  rows={3}
                  placeholder="e.g. A minimalist bird with a coffee bean in its beak, soft blues and creams."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* Styles */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Choose a Style</label>
                <StylePicker 
                  selected={config.style} 
                  onSelect={(style) => setConfig({...config, style})} 
                />
              </div>

              {/* Advanced Options */}
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[150px] space-y-2">
                  <label className="text-sm font-medium text-slate-300">Aspect Ratio</label>
                  <select 
                    value={config.aspectRatio}
                    onChange={(e) => setConfig({...config, aspectRatio: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    {ASPECT_RATIOS.map(ar => (
                      <option key={ar.value} value={ar.value}>{ar.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setConfig({...config, isPro: !config.isPro})}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    config.isPro 
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.293 3.293a1 1 0 01-1.414 0l-3.293-3.293a1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Pro Mode
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                  isGenerating 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Logo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Generated <span className="text-slate-400">Gallery</span></h2>
              <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{logos.length} Items</span>
            </div>

            {logos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500 bg-slate-900/20">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-400 mb-2">No logos yet</h3>
                <p className="max-w-xs mx-auto">
                  Start generating to build your brand identity. Your creations will appear here.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar pb-12">
                {logos.map((logo) => (
                  <LogoCard 
                    key={logo.id} 
                    logo={logo} 
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 LogosAI. Powered by Gemini. Images generated are subject to API licensing.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
