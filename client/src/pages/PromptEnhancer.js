import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Wand2, Image as ImageIcon, Video, Sparkles, Copy, Check, Loader2, RefreshCw } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const IMAGE_ENGINES = ['Midjourney v6', 'DALL-E 3', 'Stable Diffusion XL', 'Flux.1 Pro'];
const VIDEO_ENGINES = ['Runway Gen-3 Alpha', 'Sora', 'Kling AI', 'Luma Dream Machine'];
const STYLES = ['Cinematic / Movie Still', 'Ultra-Photorealistic', '3D Render / Unreal Engine', 'Stylized / Digital Art', 'Anime / Studio Ghibli', 'Dark Moody / Gothic', 'Neon Cyberpunk'];

const PromptEnhancer = () => {
  const [loading, setLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    originalPrompt: '',
    mediaType: 'image',
    targetEngine: 'Midjourney v6',
    enhancementStyle: 'Cinematic / Movie Still'
  });

  const handleMediaTypeChange = (type) => {
    setFormData({
      ...formData,
      mediaType: type,
      targetEngine: type === 'image' ? IMAGE_ENGINES[0] : VIDEO_ENGINES[0]
    });
  };

  const handleEnhance = async (e) => {
    e.preventDefault();
    if (!formData.originalPrompt.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${API_URL}/api/enhance-prompt`, formData);
      setResult(res.data);
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance prompt. The AI might be overloaded.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, isNegative) => {
    navigator.clipboard.writeText(text);
    if (isNegative) {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const isVideo = formData.mediaType === 'video';

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>AI Prompt Enhancer | Pro Tools</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 bg-purple-500/10 text-purple-400">
            <RefreshCw size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Prompt <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(to right, #a855f7, #ec4899)' }}>Enhancer</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Paste your basic, messy, or short ideas. Our AI will automatically rewrite and optimize them into professional, highly-detailed prompts for top-tier image and video models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: INPUT AREA */}
          <div className="card p-6 md:p-8 flex flex-col h-full border border-white/5">
            <form onSubmit={handleEnhance} className="flex flex-col h-full space-y-6">
              
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
                  className="w-full sm:w-auto p-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-semibold outline-none focus:border-purple-500"
                >
                  {isVideo ? VIDEO_ENGINES.map(e => <option key={e} value={e}>{e}</option>) : IMAGE_ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* Style Dropdown */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block flex items-center gap-2">
                  <Wand2 size={14} className="text-purple-400" /> Enhancement Target Style
                </label>
                <select 
                  value={formData.enhancementStyle} 
                  onChange={(e) => setFormData({...formData, enhancementStyle: e.target.value})} 
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-purple-500"
                >
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Text Area */}
              <div className="flex-grow flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                  Original Rough Prompt
                </label>
                <textarea 
                  required
                  value={formData.originalPrompt}
                  onChange={(e) => setFormData({...formData, originalPrompt: e.target.value})}
                  className="w-full flex-grow min-h-[200px] p-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-purple-500 resize-none font-mono text-sm leading-relaxed"
                  placeholder="e.g. A cat drinking coffee on the moon..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !formData.originalPrompt.trim()}
                className="w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest text-white transition-all hover-lift flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: loading ? 'var(--bg-hover)' : 'linear-gradient(to right, #a855f7, #ec4899)', boxShadow: loading ? 'none' : '0 4px 20px rgba(168, 85, 247, 0.4)' }}
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Optimizing...</> : <><Sparkles size={18} /> Enhance Prompt</>}
              </button>
            </form>
          </div>

          {/* RIGHT: OUTPUT AREA */}
          <div className="flex flex-col h-full space-y-4">
            {!loading && !result && (
              <div className="card p-8 flex flex-col items-center justify-center text-center h-full border-dashed border-white/10 min-h-[400px]">
                <Sparkles size={48} className="text-purple-500/30 mb-4" />
                <p className="text-gray-400 font-medium">Your enhanced, studio-grade prompt will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="card p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-purple-400 font-bold animate-pulse">Engineering parameters...</p>
              </div>
            )}

            {result && (
              <div className="flex flex-col h-full space-y-4 animate-fade-in">
                {/* Main Enhanced Prompt */}
                <div className="card p-6 border border-purple-500/30 flex-grow relative group flex flex-col">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      Enhanced Output
                    </span>
                    <button 
                      onClick={() => copyText(result.enhancedPrompt, false)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      {copiedPrompt ? <><Check size={14}/> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                  <p className="text-[15px] font-mono text-gray-200 leading-relaxed overflow-y-auto hide-scrollbar flex-grow selection:bg-purple-500/30">
                    {result.enhancedPrompt}
                  </p>
                </div>

                {/* Negative Prompt */}
                {result.negativePrompt && (
                  <div className="card p-5 border border-red-500/20 bg-red-500/5 relative shrink-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                        Negative Restrictions
                      </span>
                      <button 
                        onClick={() => copyText(result.negativePrompt, true)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedNegative ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-gray-400 italic leading-relaxed line-clamp-3">
                      {result.negativePrompt}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PromptEnhancer;