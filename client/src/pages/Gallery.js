import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Copy, Sparkles, TrendingUp, X, ZoomIn, Star, Eye, Heart, ChevronDown, Check, Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';
import CoffeeButton from '../components/CoffeeButton';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://client-theta-coral.vercel.app';

const CATEGORY_STRUCTURE = {
  'All': ['All'],
  'Media Type': ['Image', 'Video'],
  'AI Model': [
    'Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Runway Gen-2', 
    'Gemini', 'ChatGPT', 'Grok', 'Claude', 'Leonardo AI', 'Nano Banana'
  ],
  'Industry': [
    'Real Estate', 'Entertainment', 'Marketing', 'Gaming', 
    'Fashion', 'Education', 'Healthcare', 'Finance', 'Technology'
  ],
  'Style': [
    'Portrait', 'Landscape', 'Logo', 'Abstract', 'Photorealistic', 
    'Artistic', 'Minimalist', 'Cyberpunk', 'Fantasy'
  ]
};

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [promptOfDay, setPromptOfDay] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    subcategory: 'All',
    trending: false
  });
  const [toast, setToast] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch prompts triggered by page, filters, or search
  useEffect(() => {
    const fetchPrompts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 24); // Load 24 items at a time
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        
        if (filters.category !== 'All' && filters.subcategory !== 'All') {
          switch (filters.category) {
            case 'AI Model':
              params.append('model', filters.subcategory);
              break;
            case 'Industry':
              params.append('industry', filters.subcategory);
              break;
            case 'Media Type':
              params.append('mediaType', filters.subcategory.toLowerCase());
              break;
            case 'Style':
              params.append('topic', filters.subcategory);
              break;
            default:
              params.append('topic', filters.subcategory);
          }
        }
        
        if (filters.trending) {
          params.append('trending', 'true');
        }
        
        const res = await axios.get(`${API_URL}/api/prompts?${params.toString()}`);
        
        if (page === 1) {
          setPrompts(res.data.prompts);
        } else {
          setPrompts(prev => [...prev, ...res.data.prompts]);
        }
        
        setHasMore(res.data.currentPage < res.data.totalPages);
        setTotalCount(res.data.totalPrompts);

      } catch (error) {
        setToast({ message: 'Error loading prompts', type: 'error' });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    // Add a tiny delay so it doesn't spam the API on every single keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchPrompts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, page, searchQuery]);

  // Reset page to 1 when filters or search query changes
  useEffect(() => {
    setPage(1);
  }, [filters, searchQuery]);

  useEffect(() => {
    const fetchPromptOfDay = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/prompts/prompt-of-the-day`);
        if (res.data && res.data._id) {
          setPromptOfDay(res.data);
        }
      } catch (error) {
        console.error('Error fetching prompt of the day:', error);
      }
    };

    fetchPromptOfDay();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveFilter(null);
  };

  const clearFilters = () => {
    setFilters({ category: 'All', subcategory: 'All', trending: false });
    setSearchQuery('');
    setActiveFilter(null);
  };

  const hasActiveFilters = filters.category !== 'All' || filters.subcategory !== 'All' || filters.trending || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>AI Prompt Library - Free Midjourney, DALL-E & Stable Diffusion Prompts</title>
        <meta name="description" content="Discover thousands of free AI prompts for Midjourney, DALL-E 3, Stable Diffusion. Browse by category, AI model, and style." />
        <meta name="keywords" content="AI prompts, Midjourney prompts, DALL-E prompts, Stable Diffusion prompts, AI art, prompt library, free prompts" />
        <meta name="author" content="AI Prompt Library" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={BASE_URL} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:title" content="AI Prompt Library - Free AI Prompts" />
        <meta property="og:description" content="Discover thousands of free AI prompts for Midjourney, DALL-E 3, Stable Diffusion." />
        <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
        <meta property="og:site_name" content="AI Prompt Library" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={BASE_URL} />
        <meta property="twitter:title" content="AI Prompt Library - Free AI Prompts" />
        <meta property="twitter:description" content="Discover thousands of free AI prompts." />
        <meta property="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
        
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Helmet>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
            src={selectedImage} 
            alt="Full size prompt preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-glow-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ============================================
          🎯 HERO SECTION WITH SEARCH BAR
          ============================================ */}
      <section className="py-10 px-4 gradient-hero border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 gradient-text tracking-tight">
            AI Prompt Library
          </h1>
          
          <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto font-light" style={{ color: 'var(--text-secondary)' }}>
            Discover <span style={{ color: 'var(--primary-400)', fontWeight: '500' }}>free AI prompts</span> for Midjourney, DALL-E 3 & Stable Diffusion.
          </p>

          {/* Search Bar Moved Inside Hero Section */}
          <div className="max-w-2xl mx-auto mb-6 relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search prompts, models, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-full text-sm transition-all outline-none"
              style={{ 
                backgroundColor: 'var(--bg-elevated)', 
                border: '1px solid var(--border-light)', 
                color: 'var(--text-primary)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-400)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {promptOfDay && (
            <Link 
              to={`/prompt/${promptOfDay.slug || promptOfDay._id}`} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all card hover-lift"
              style={{ display: 'inline-flex' }}
            >
              <Star size={14} style={{ color: 'var(--accent-yellow)' }} fill="currentColor" />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Prompt of the Day:</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{promptOfDay.title}</span>
            </Link>
          )}
        </div>
      </section>

      {/* ============================================
          🔍 VISIBLE FILTER BAR
          ============================================ */}
      <section className="relative z-40 py-4 px-4 border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* All Button */}
            <button
              onClick={() => handleFilterChange('category', 'All')}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                filters.category === 'All' ? 'shadow-glow-primary' : ''
              }`}
              style={{ 
                backgroundColor: filters.category === 'All' ? 'var(--primary-600)' : 'var(--bg-card)',
                color: filters.category === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: `1px solid ${filters.category === 'All' ? 'transparent' : 'var(--border-light)'}`
              }}
            >
              <Sparkles size={14} />
              All
            </button>

            {/* Trending Toggle */}
            <button
              onClick={() => handleFilterChange('trending', !filters.trending)}
              className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: filters.trending ? 'linear-gradient(135deg, var(--accent-yellow) 0%, #ea580c 100%)' : 'var(--bg-card)',
                color: filters.trending ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: `1px solid ${filters.trending ? 'transparent' : 'var(--border-light)'}`,
                boxShadow: filters.trending ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              <TrendingUp size={14} />
              Trending
            </button>

            {/* Divider */}
            <div className="w-px h-6 mx-1 shrink-0 hidden sm:block" style={{ backgroundColor: 'var(--border-light)' }}></div>

            {/* 1. Media Type Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveFilter(activeFilter === 'media' ? null : 'media')}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: filters.category === 'Media Type' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                  color: filters.category === 'Media Type' ? 'var(--primary-400)' : 'var(--text-secondary)',
                  border: `1px solid ${filters.category === 'Media Type' ? 'var(--border-primary)' : 'var(--border-light)'}`
                }}
              >
                <span>Media</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeFilter === 'media' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFilter === 'media' && (
                <div className="absolute top-full left-0 mt-2 w-40 rounded-xl overflow-hidden z-50 card animate-slide-up" style={{ padding: '0.5rem 0' }}>
                  {CATEGORY_STRUCTURE['Media Type'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        handleFilterChange('category', 'Media Type');
                        handleFilterChange('subcategory', type);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {type}
                      {filters.subcategory === type && <Check size={14} style={{ color: 'var(--primary-400)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. AI Model Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveFilter(activeFilter === 'model' ? null : 'model')}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: filters.category === 'AI Model' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                  color: filters.category === 'AI Model' ? 'var(--primary-400)' : 'var(--text-secondary)',
                  border: `1px solid ${filters.category === 'AI Model' ? 'var(--border-primary)' : 'var(--border-light)'}`
                }}
              >
                <span>Model</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeFilter === 'model' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFilter === 'model' && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl overflow-hidden z-50 card animate-slide-up max-h-64 overflow-y-auto hide-scrollbar" style={{ padding: '0.5rem 0' }}>
                  {CATEGORY_STRUCTURE['AI Model'].map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        handleFilterChange('category', 'AI Model');
                        handleFilterChange('subcategory', model);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {model}
                      {filters.subcategory === model && <Check size={14} style={{ color: 'var(--primary-400)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Industry Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveFilter(activeFilter === 'industry' ? null : 'industry')}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: filters.category === 'Industry' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                  color: filters.category === 'Industry' ? 'var(--primary-400)' : 'var(--text-secondary)',
                  border: `1px solid ${filters.category === 'Industry' ? 'var(--border-primary)' : 'var(--border-light)'}`
                }}
              >
                <span>Industry</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeFilter === 'industry' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFilter === 'industry' && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl overflow-hidden z-50 card animate-slide-up max-h-64 overflow-y-auto hide-scrollbar" style={{ padding: '0.5rem 0' }}>
                  {CATEGORY_STRUCTURE['Industry'].map((industry) => (
                    <button
                      key={industry}
                      onClick={() => {
                        handleFilterChange('category', 'Industry');
                        handleFilterChange('subcategory', industry);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {industry}
                      {filters.subcategory === industry && <Check size={14} style={{ color: 'var(--primary-400)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Style/Topic Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveFilter(activeFilter === 'style' ? null : 'style')}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: filters.category === 'Style' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                  color: filters.category === 'Style' ? 'var(--primary-400)' : 'var(--text-secondary)',
                  border: `1px solid ${filters.category === 'Style' ? 'var(--border-primary)' : 'var(--border-light)'}`
                }}
              >
                <span>Style</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeFilter === 'style' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFilter === 'style' && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden z-50 card animate-slide-up max-h-64 overflow-y-auto hide-scrollbar" style={{ padding: '0.5rem 0' }}>
                  {CATEGORY_STRUCTURE['Style'].map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        handleFilterChange('category', 'Style');
                        handleFilterChange('subcategory', style);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {style}
                      {filters.subcategory === style && <Check size={14} style={{ color: 'var(--primary-400)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs transition-colors flex items-center gap-1 shrink-0 px-2"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ============================================
          🖼️ PROMPT GALLERY - CSS MASONRY LAYOUT
          ============================================ */}
      <main className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {loading && page === 1 ? (
            <div className="text-center py-20 animate-pulse-slow">
              <div className="rounded-full h-10 w-10 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--primary-500)' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Loading prompts...</p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-24 card border-dashed">
              <Sparkles size={40} className="mx-auto mb-4" style={{ color: 'var(--border-medium)' }} />
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>No prompts found</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ color: 'var(--primary-400)' }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ULTRA TIGHT SPACING: gap-2 (8px) horizontal space */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2">
                {prompts.map((prompt) => {
                  const isVideo = prompt.mediaType === 'video';
                  
                  return (
                    <Link
                      key={prompt._id}
                      to={`/prompt/${prompt.slug || prompt._id}`}
                      /* ULTRA TIGHT SPACING: mb-2 (8px) vertical space */
                      className="group relative block mb-2 masonry-item overflow-hidden card hover-lift"
                    >
                      <div className="relative w-full">
                        {isVideo ? (
                          <video 
                            src={prompt.mediaUrl} 
                            className="w-full h-auto object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => {
                              const playPromise = e.target.play();
                              if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                  // Safely catches the interruption error without crashing the app
                                  console.log("Video playback safely interrupted");
                                });
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.target.pause();
                              e.target.currentTime = 0;
                            }}
                          />
                        ) : (
                          <>
                            <img 
                              src={prompt.mediaUrl} 
                              alt={prompt.title}
                              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
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
                                <Heart size={12} />
                                {prompt.views || 0}
                              </span>
                            </div>
                            
                            {prompt.isTrending && (
                              <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--accent-yellow)' }}>
                                <Sparkles size={12} />
                                Trending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Floating Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                          {prompt.isTrending && (
                            <span className="badge badge-yellow" style={{ background: 'linear-gradient(135deg, var(--accent-yellow) 0%, #ea580c 100%)', color: '#fff', border: 'none' }}>
                              <Sparkles size={10} /> TRENDING
                            </span>
                          )}
                          {prompt.isPromptOfDay && (
                            <span className="badge badge-purple">
                              <Star size={10} fill="currentColor" /> POTD
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* ⚡ PAGINATION LOAD MORE BUTTON */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loadingMore}
                    className="px-8 py-3 rounded-full font-bold text-sm transition-all hover-lift flex items-center gap-2"
                    style={{ 
                      backgroundColor: 'var(--bg-card)', 
                      color: 'var(--text-primary)', 
                      border: '1px solid var(--border-light)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    {loadingMore ? (
                      <><Loader2 className="animate-spin" size={16} /> Loading...</>
                    ) : (
                      'Load More Prompts'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;