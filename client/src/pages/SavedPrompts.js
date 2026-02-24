import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Trash2, ZoomIn, Eye, Sparkles, Star, X, Check } from 'lucide-react';
import axios from 'axios';
import Toast from '../components/Toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://client-theta-coral.vercel.app';

// ⚡ SPEED OPTIMIZATION: Auto-compress Cloudinary images to WebP format
const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

const SavedPrompts = () => {
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchSavedPrompts();
  }, []);

  const fetchSavedPrompts = async () => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
      
      if (savedIds.length === 0) {
        setSavedPrompts([]);
        setLoading(false);
        return;
      }

      // Fetch all prompts and filter client-side since this is a local user preference
      const res = await axios.get(`${API_URL}/api/prompts`);
      const filtered = res.data.prompts ? res.data.prompts.filter(prompt => savedIds.includes(prompt._id)) : res.data.filter(prompt => savedIds.includes(prompt._id));
      setSavedPrompts(filtered);
    } catch (error) {
      setToast({ message: 'Error loading saved prompts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removePrompt = (e, id) => {
    e.preventDefault(); // Stop the link from triggering when clicking the trash can
    e.stopPropagation();
    
    const savedIds = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
    const updated = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem('savedPrompts', JSON.stringify(updated));
    
    // Update state immediately for snappy UI
    setSavedPrompts(prev => prev.filter(p => p._id !== id));
    
    setToast({ message: 'Removed from saved', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--accent-red)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 animate-fade-in pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>My Saved Prompts | AI Prompt Library</title>
        <meta name="description" content="View your personal collection of saved AI prompts for Midjourney, DALL-E, and Stable Diffusion." />
        <meta name="robots" content="noindex, nofollow" /> {/* Don't index personal saved pages */}
      </Helmet>

      {/* Modern Floating Toast */}
      {toast && (
        <div 
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl animate-slide-up backdrop-blur-md font-medium text-sm text-white flex items-center gap-2"
          style={{ 
            backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full transition-colors hover:text-white"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)' }}
            onClick={() => setSelectedImage(null)}
            aria-label="Close image viewer"
          >
            <X size={24} />
          </button>
          <img 
            src={optimizeCloudinaryUrl(selectedImage)} 
            alt="Full size prompt preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-glow-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Premium Header */}
        <header className="mb-12 pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-light)' }}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <Heart size={12} style={{ color: 'var(--accent-red)' }} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-red)' }}>Personal Library</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Saved Prompts
              </h1>
            </div>
            <p className="text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              {savedPrompts.length} items stored in browser
            </p>
          </div>
        </header>

        {savedPrompts.length === 0 ? (
          <div className="text-center py-24 card border-dashed max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-5 rounded-full mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <Heart size={40} style={{ color: 'var(--accent-red)' }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your library is empty</h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Explore our gallery and click the heart icon to save your favorite prompts here for quick access later.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-all hover-lift"
              style={{ backgroundColor: 'var(--primary-600)', color: '#fff', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
            >
              Explore Gallery
            </Link>
          </div>
        ) : (
          <main className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {savedPrompts.map((prompt) => {
              const isVideo = prompt.mediaType === 'video';
              
              return (
                <Link
                  key={prompt._id}
                  to={`/prompt/${prompt.slug || prompt._id}`}
                  className="group relative block mb-6 masonry-item overflow-hidden card hover-lift"
                >
                  <div className="relative w-full">
                    {isVideo ? (
                      <video 
                        src={prompt.mediaUrl} 
                        className="w-full h-auto object-cover"
                        muted
                        loop
                        onMouseOver={e => e.target.play()}
                        onMouseOut={e => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                    ) : (
                      <>
                        <img 
                          src={optimizeCloudinaryUrl(prompt.mediaUrl)} 
                          alt={prompt.title}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <button 
                          className="absolute top-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 hover-lift shadow-lg"
                          style={{ backgroundColor: 'rgba(26, 26, 37, 0.8)', backdropFilter: 'blur(4px)', color: 'var(--text-primary)' }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedImage(prompt.mediaUrl); }}
                          aria-label="Quick zoom"
                          title="Quick zoom"
                        >
                          <ZoomIn size={16} />
                        </button>
                      </>
                    )}

                    {/* Trash Button - Always visible on mobile, hover on desktop */}
                    <button
                      onClick={(e) => removePrompt(e, prompt._id)}
                      className="absolute top-3 left-3 p-2 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-30 hover-lift shadow-lg"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.9)', backdropFilter: 'blur(4px)', color: '#fff' }}
                      title="Remove from saved"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Info Overlay Gradient */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.5) 50%, transparent 100%)' }}
                    >
                      <h3 className="font-bold text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {prompt.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="badge badge-primary">
                          {prompt.aiModel}
                        </span>
                        {prompt.topic && (
                          <span className="badge" style={{ backgroundColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>
                            {prompt.topic}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)' }}>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {prompt.copyCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} fill="currentColor" style={{ color: 'var(--accent-red)' }} />
                            Saved
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </main>
        )}
      </div>
    </div>
  );
};

export default SavedPrompts;