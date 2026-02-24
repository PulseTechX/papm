import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { 
  Wand2, Settings, Image as ImageIcon, Video, 
  Lightbulb, Monitor, Loader, Copy, Check, Sparkles, Layers
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Dynamic AI Engines
const IMAGE_ENGINES = ['Midjourney v6', 'DALL-E 3', 'Stable Diffusion XL', 'Flux.1 Pro'];
const VIDEO_ENGINES = ['Runway Gen-3 Alpha', 'Sora', 'Kling AI', 'Luma Dream Machine', 'Pika Labs'];

// Master Jargon Arrays (Added 'None' to all)
const MEDIUMS = ['None', 'Photography', '3D Render', 'Oil Painting', 'Digital Art', 'Anime', 'Concept Art', 'Cinematic Film Still', 'Polaroid', 'Comic Book Style'];
const LIGHTING = ['None', 'Cinematic Lighting', 'Golden Hour', 'Volumetric Lighting', 'Neon Cyberpunk', 'Studio Setup', 'Rembrandt Lighting', 'Rim Lighting', 'Bioluminescence'];
const CAMERAS = ['None', 'Wide Angle', 'Macro Close-up', 'Drone View', 'Eye-level', 'Low Angle', 'Dutch Angle', 'Overhead'];
const LENSES = ['None', '35mm', '85mm Portrait', '14mm Ultra-Wide', 'GoPro', 'Tilt-Shift', 'Fisheye', 'Telephoto'];
const RENDERS = ['None', 'Unreal Engine 5', 'Octane Render', 'Raytracing', '8k Resolution', 'Hyper-realistic', 'V-Ray', 'Cel Shaded'];
const MOODS = ['None', 'Dark & Moody', 'Ethereal & Dreamy', 'Vibrant & Colorful', 'Minimalist', 'Epic & Grand', 'Cozy & Warm', 'Surreal & Bizarre'];
const MOTIONS = ['None', 'Slow Pan Right', 'FPV Drone Flight', 'Cinematic Push-in', 'Static Tripod', 'Handheld Shaky', 'Orbit Around', 'Hyperlapse', 'Slow Motion (120fps)'];
const RATIOS = ['16:9', '9:16', '1:1', '21:9', '4:5', '3:2'];

// Pro Specs Expansion (Added 'None' to all)
const COLOR_GRADING = ['None', 'Teal & Orange', 'Bleach Bypass', 'Neon Synthwave', 'Pastel & Soft', 'Monochromatic', 'High Contrast', 'Sepia Tone', 'Muted & Desaturated'];
const WEATHER = ['None', 'Clear Sky', 'Heavy Rain & Puddles', 'Thick Fog / Mist', 'Snowstorm', 'Sandstorm', 'Overcast', 'Thunder & Lightning'];
const TIME_OF_DAY = ['None', 'Golden Hour', 'Blue Hour', 'High Noon', 'Midnight', 'Twilight', 'Sunrise', 'Neon Night'];
const COMPOSITIONS = ['None', 'Rule of Thirds', 'Perfect Symmetry', 'Leading Lines', 'Golden Ratio', 'Framed within a Frame', 'Dynamic Diagonal'];
const VFX = ['None', 'Cinematic Lens Flare', 'Volumetric Dust', 'Chromatic Aberration', 'Film Grain', 'Light Leaks', 'Depth of Field (Bokeh)', 'Subsurface Scattering'];
const FILM_STOCKS = ['None', 'Kodak Portra 400', 'Fujifilm Superia', 'Cinestill 800T', 'Ilford B&W', 'Vintage VHS', 'IMAX 70mm', 'Technicolor'];
const TEXTURES = ['None', 'Glossy & Reflective', 'Matte & Rough', 'Wet & Slick', 'Metallic & Chrome', 'Organic & Fleshy', 'Woven Fabric', 'Holographic & Iridescent'];
const ERAS = ['None', 'Prehistoric', 'Ancient Rome', 'Medieval Gothic', 'Victorian Era', '1920s Roaring Twenties', '1980s Retro', 'Modern Day', 'Cyberpunk 2077', 'Post-Apocalyptic'];

const PromptGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  
  const [formData, setFormData] = useState({
    mediaType: 'image',
    targetEngine: 'Midjourney v6',
    aspectRatio: '16:9',
    subject: '',
    action: '',
    setting: '',
    // All specs now default to None
    medium: 'None',
    lighting: 'None',
    cameraAngle: 'None',
    lens: 'None',
    renderEngine: 'None',
    mood: 'None',
    cameraMotion: 'None',
    colorGrading: 'None',
    weather: 'None',
    timeOfDay: 'None',
    composition: 'None',
    vfx: 'None',
    filmStock: 'None',
    texture: 'None',
    era: 'None'
  });

  const handleMediaTypeChange = (type) => {
    setFormData({
      ...formData,
      mediaType: type,
      targetEngine: type === 'image' ? IMAGE_ENGINES[0] : VIDEO_ENGINES[0]
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.subject) return alert("Please enter a main subject!");
    
    setLoading(true);
    setResult(null);
    
    try {
      const res = await axios.post(`${API_URL}/api/generate-prompt`, formData);
      setResult(res.data);
    } catch (error) {
      console.error('Error generating:', error);
      alert('Failed to generate prompts. Please try again.');
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
    <div className="min-h-screen py-12 pb-24 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Pro AI Prompt Generator | AI Prompt Library</title>
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-400)' }}>
            <Wand2 size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Master Prompt <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Input basic concepts, and our AI will engineer a single, master-level prompt using professional cinematography and VFX parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE CONTROL PANEL */}
          <div className="xl:col-span-8 space-y-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              
              {/* Core Setup & Media Type */}
              <div className="card p-6 border-glow">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Monitor size={18} className="text-blue-500" /> Core Setup</span>
                  
                  {/* Media Type Toggle */}
                  <div className="flex bg-black/50 rounded-xl p-1 border border-white/10">
                    <button 
                      type="button"
                      onClick={() => handleMediaTypeChange('image')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isVideo ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <ImageIcon size={14} /> Image
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleMediaTypeChange('video')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isVideo ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Video size={14} /> Video
                    </button>
                  </div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Target AI Model</label>
                    <select name="targetEngine" value={formData.targetEngine} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500">
                      {isVideo ? VIDEO_ENGINES.map(e => <option key={e} value={e}>{e}</option>) : IMAGE_ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Aspect Ratio</label>
                    <select name="aspectRatio" value={formData.aspectRatio} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500">
                      {RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* The Scene */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Layers size={18} className="text-green-500" /> Subject & Environment
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Main Subject (Be specific) *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g., A cybernetic samurai, A futuristic sports car..." className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-green-500" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Action / Pose</label>
                      <input type="text" name="action" value={formData.action} onChange={handleChange} placeholder="e.g., Looking at camera" className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-green-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Setting / Location</label>
                      <input type="text" name="setting" value={formData.setting} onChange={handleChange} placeholder="e.g., Tokyo alleyway" className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-green-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Era / Time Period</label>
                      <select name="era" value={formData.era} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-green-500">
                        {ERAS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* MASSIVE PRO SPECS PANEL */}
              <div className="card p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Settings size={18} className="text-purple-400" /> Professional Cinematography & VFX Specs
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  
                  {/* Row 1 */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Art Medium</label>
                    <select name="medium" value={formData.medium} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {MEDIUMS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Lighting Setup</label>
                    <select name="lighting" value={formData.lighting} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {LIGHTING.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Camera Angle</label>
                    <select name="cameraAngle" value={formData.cameraAngle} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {CAMERAS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Lens</label>
                    <select name="lens" value={formData.lens} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {LENSES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Row 2: The New Jargon */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Film Stock</label>
                    <select name="filmStock" value={formData.filmStock} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {FILM_STOCKS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Color Grading</label>
                    <select name="colorGrading" value={formData.colorGrading} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {COLOR_GRADING.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Visual Effects (VFX)</label>
                    <select name="vfx" value={formData.vfx} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {VFX.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Composition</label>
                    <select name="composition" value={formData.composition} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {COMPOSITIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Weather</label>
                    <select name="weather" value={formData.weather} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {WEATHER.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Time of Day</label>
                    <select name="timeOfDay" value={formData.timeOfDay} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {TIME_OF_DAY.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Materials / Textures</label>
                    <select name="texture" value={formData.texture} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {TEXTURES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Render Engine</label>
                    <select name="renderEngine" value={formData.renderEngine} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {RENDERS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80 mb-2 block">Mood / Vibe</label>
                    <select name="mood" value={formData.mood} onChange={handleChange} className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-purple-500">
                      {MOODS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Video Specific Motion */}
              {isVideo && (
                <div className="card p-6 border-glow" style={{ '--primary-500': 'var(--accent-yellow)' }}>
                  <h2 className="text-sm font-bold text-yellow-500 mb-3 flex items-center gap-2">
                    <Video size={16} /> Advanced Video Camera Motion
                  </h2>
                  <select name="cameraMotion" value={formData.cameraMotion} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-yellow-500">
                    {MOTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 rounded-xl font-extrabold text-base uppercase tracking-widest text-white transition-all shadow-glow-primary hover-lift flex items-center justify-center gap-3"
                style={{ backgroundColor: loading ? 'var(--bg-hover)' : 'var(--primary-600)' }}
              >
                {loading ? <><Loader className="animate-spin" size={20} /> Engineering Masterpiece...</> : <><Sparkles size={20} /> Generate Professional Prompt</>}
              </button>

            </form>
          </div>

          {/* RIGHT: THE OUTPUT DISPLAY */}
          <div className="xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Master Prompt Result</h2>
            
            {!loading && !result && (
              <div className="card p-12 text-center border-dashed flex flex-col items-center justify-center min-h-[500px]">
                <Lightbulb size={48} className="mb-4 text-gray-600" />
                <p className="text-gray-400 font-medium leading-relaxed">
                  Select your advanced cinematography options.<br/> Our AI will weave them into the perfect, studio-grade prompt.
                </p>
              </div>
            )}

            {loading && (
              <div className="card p-12 text-center animate-pulse flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-400 font-bold animate-pulse">Processing VFX & Lighting Dynamics...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* Main Prompt */}
                <div className="card p-6 border border-primary-500/30 shadow-glow-primary relative group">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Primary Prompt
                    </span>
                    <button 
                      onClick={() => copyText(result.prompt, false)}
                      className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      {copiedPrompt ? <><Check size={14}/> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                  <p className="text-[15px] font-mono text-gray-200 leading-relaxed selection:bg-primary-500/30">
                    {result.prompt}
                  </p>
                </div>

                {/* AI Generated Negative Prompt */}
                {result.negativePrompt && (
                  <div className="card p-6 border border-red-500/20 bg-red-500/5 relative group mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                        Negative Restrictions
                      </span>
                      <button 
                        onClick={() => copyText(result.negativePrompt, true)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                      >
                        {copiedNegative ? <><Check size={14} className="text-green-500"/> <span className="text-green-500">Copied</span></> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-gray-400 italic leading-relaxed">
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

export default PromptGenerator;