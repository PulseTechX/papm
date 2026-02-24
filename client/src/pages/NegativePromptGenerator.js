import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ShieldAlert, Image as ImageIcon, Video, Copy, Check, Loader2, Ban } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const IMAGE_ENGINES = ['Midjourney v6', 'Stable Diffusion XL', 'Flux.1 Pro', 'DALL-E 3'];
const VIDEO_ENGINES = ['Runway Gen-3 Alpha', 'Sora', 'Kling AI', 'Luma Dream Machine'];
const AVOID_STYLES = ['None', 'Cartoon & Anime', 'Photorealism', '3D Render / CGI', 'Vintage / Retro', 'Painting / Illustration'];

const NegativePromptGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    mediaType: 'image',
    targetEngine: 'Midjourney v6',
    avoidStyle: 'None',
    baseContext: '', // What is the actual image of? (Helps context)
    specificBans: '' // Specific things to remove (e.g. "red cars, trees, text")
  });

  const handleMediaTypeChange = (type) => {
    setFormData({
      ...formData,
      mediaType: type,
      targetEngine: type === 'image' ? IMAGE_ENGINES[0] : VIDEO_ENGINES[0]
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${API_URL}/api/generate-negative-prompt`, formData);
      setResult(res.data);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate negative prompt. The AI might be overloaded.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    if (result?.negativePrompt) {
      navigator.clipboard.writeText(result.negativePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isVideo = formData.mediaType === 'video';

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Advanced Negative Prompt Generator | Pro Tools</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 bg-red-500/10 text-red-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Negative Prompt <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(to right, #ef4444, #f97316)' }}>Generator</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Block artifacts, fix bad anatomy, and ban specific elements. Our AI engineers exhaustive negative restrictions for top-tier image and video models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: INPUT AREA */}
          <div className="lg:col-span-7 card p-6 md:p-8 flex flex-col border border-white/5">
            <form onSubmit={handleGenerate} className="flex flex-col h-full space-y-6">
              
              {/* Media Toggle & Engine Select */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="flex bg-black/50 rounded-lg p-1 border border-white/10 w-full sm:w-auto">
                  <button 
                    type="button"
                    onClick={() => handleMediaTypeChange('image')}
                    className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${!isVideo ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ImageIcon size={14} /> Image
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleMediaTypeChange('video')}
                    className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${isVideo ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Video size={14} /> Video
                  </button>
                </div>
                
                <select 
                  value={formData.targetEngine} 
                  onChange={(e) => setFormData({...formData, targetEngine: e.target.value})} 
                  className="w-full sm:w-auto p-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-semibold outline-none focus:border-red-500"
                >
                  {isVideo ? VIDEO_ENGINES.map(e => <option key={e} value={e}>{e}</option>) : IMAGE_ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Base Context */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                    What are you generating? (Context)
                  </label>
                  <input 
                    type="text"
                    value={formData.baseContext}
                    onChange={(e) => setFormData({...formData, baseContext: e.target.value})}
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-red-500 text-sm"
                    placeholder="e.g. A portrait of a woman"
                  />
                </div>

                {/* Style to Avoid */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                    Overall Style to Block
                  </label>
                  <select 
                    value={formData.avoidStyle} 
                    onChange={(e) => setFormData({...formData, avoidStyle: e.target.value})} 
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-red-500"
                  >
                    {AVOID_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Specific Bans Text Area */}
              <div className="flex-grow flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block flex items-center gap-2">
                  <Ban size={14} className="text-red-500" /> Specific Elements to Ban
                </label>
                <textarea 
                  value={formData.specificBans}
                  onChange={(e) => setFormData({...formData, specificBans: e.target.value})}
                  className="w-full flex-grow min-h-[120px] p-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-red-500 resize-none font-mono text-sm leading-relaxed"
                  placeholder="e.g. red cars, modern buildings, glasses, hats, text, watermarks..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest text-white transition-all hover-lift flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: loading ? 'var(--bg-hover)' : 'linear-gradient(to right, #ef4444, #f97316)', boxShadow: loading ? 'none' : '0 4px 20px rgba(239, 68, 68, 0.4)' }}
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Generating Safeguards...</> : <><ShieldAlert size={18} /> Generate Negative Prompt</>}
              </button>
            </form>
          </div>

          {/* RIGHT: OUTPUT AREA */}
          <div className="lg:col-span-5 flex flex-col h-full">
            {!loading && !result && (
              <div className="card p-8 flex flex-col items-center justify-center text-center h-full border-dashed border-white/10 min-h-[300px]">
                <Ban size={48} className="text-red-500/30 mb-4" />
                <p className="text-gray-400 font-medium leading-relaxed">
                  Your exhaustively detailed list of <br/>negative restrictions will appear here.
                </p>
              </div>
            )}

            {loading && (
              <div className="card p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-red-400 font-bold animate-pulse">Calculating exclusion weights...</p>
              </div>
            )}

            {result && (
              <div className="card p-6 border border-red-500/30 h-full flex flex-col relative group animate-fade-in bg-red-500/5">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-red-500/20">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Negative Prompt Output
                  </span>
                  <button 
                    onClick={copyText}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors flex items-center gap-1.5 text-xs font-bold border border-red-500/20"
                  >
                    {copied ? <><Check size={14}/> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                <p className="text-sm font-mono text-gray-300 leading-relaxed overflow-y-auto hide-scrollbar flex-grow selection:bg-red-500/30">
                  {result.negativePrompt}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default NegativePromptGenerator;