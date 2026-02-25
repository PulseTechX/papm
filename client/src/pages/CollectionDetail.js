import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Folder, Eye, Share2, Sparkles, ZoomIn, Heart, Star, X } from 'lucide-react';
import Toast from '../components/Toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://sea-lion-app-33jh5.ondigitalocean.app/';
const BASE_URL = 'https://sea-lion-app-33jh5.ondigitalocean.app/';

const CollectionDetail = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    fetchCollection();
  }, [slug]);

  const fetchCollection = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/collections/${slug}`);
      setCollection(res.data);
    } catch (error) {
      console.error('Error fetching collection:', error);
      showToast('Error loading collection', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = () => {
    const shareUrl = `${BASE_URL}/collections/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Collection link copied!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--accent-purple)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center card p-8 border-dashed">
          <p className="mb-4 text-lg" style={{ color: 'var(--text-secondary)' }}>Collection not found</p>
          <Link to="/collections" className="font-medium hover:underline transition-colors" style={{ color: 'var(--accent-purple)' }}>Back to Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 animate-fade-in pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ============================================
          🎯 SEO META TAGS FOR COLLECTION DETAIL PAGE
          ============================================ */}
      <Helmet>
        <title>{collection.title} - AI Prompt Collection | AI Prompt Library</title>
        <meta name="description" content={collection.description} />
        <meta name="keywords" content={`${collection.category}, AI prompts, ${collection.title}, prompt bundle, Midjourney, DALL-E, Stable Diffusion`} />
        <meta name="author" content="AI Prompt Library" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE_URL}/collections/${slug}`} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/collections/${slug}`} />
        <meta property="og:title" content={`${collection.title} - AI Prompt Collection`} />
        <meta property="og:description" content={collection.description} />
        <meta property="og:image" content={collection.coverImage} />
        <meta property="og:site_name" content="AI Prompt Library" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${BASE_URL}/collections/${slug}`} />
        <meta property="twitter:title" content={collection.title} />
        <meta property="twitter:description" content={collection.description} />
        <meta property="twitter:image" content={collection.coverImage} />
        
        <meta name="theme-color" content="#0a0a0f" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Collection",
            "name": collection.title,
            "url": `${BASE_URL}/collections/${slug}`,
            "description": collection.description,
            "image": collection.coverImage,
            "publisher": {
              "@type": "Organization",
              "name": "AI Prompt Library",
              "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/logo192.png`
              }
            },
            "hasPart": collection.prompts?.slice(0, 10).map(prompt => ({
              "@type": "CreativeWork",
              "name": prompt.title,
              "url": `${BASE_URL}/prompt/${prompt.slug || prompt._id}`,
              "image": prompt.mediaUrl
            })),
            "numberOfItems": collection.prompts?.length || 0
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_URL
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Collections",
                "item": `${BASE_URL}/collections`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": collection.title,
                "item": `${BASE_URL}/collections/${slug}`
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Modern Floating Toast */}
      {toast && (
        <div 
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl animate-slide-up backdrop-blur-md font-medium text-sm text-white"
          style={{ 
            backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
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
            className="absolute top-6 right-6 p-2 rounded-full transition-colors"
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
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link 
            to="/collections" 
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white bg-[#12121a] px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Collections</span>
          </Link>
        </nav>

        {/* Premium Collection Header Card */}
        <header className="card overflow-hidden mb-12" style={{ border: '1px solid var(--border-light)' }}>
          <div className="flex flex-col md:flex-row">
            {/* Image Side */}
            <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <img 
                src={collection.coverImage} 
                alt={`${collection.title} - ${collection.category} AI prompt collection cover image`} 
                className="w-full h-full object-cover absolute inset-0"
                loading="eager"
              />
            </div>
            
            {/* Content Side */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none -z-10"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 w-fit border" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                <Folder size={12} style={{ color: 'var(--accent-purple)' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-purple)' }}>{collection.category}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                {collection.title}
              </h1>
              
              <p className="text-base md:text-lg mb-8 leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                {collection.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Folder size={16} />
                  <span>{collection.prompts?.length || 0} Prompts</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Eye size={16} />
                  <span>{collection.views || 0} Views</span>
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:text-white ml-auto sm:ml-0 hover-lift"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}
                  aria-label="Share collection"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 🖼️ TRUE MASONRY GRID (Matches Homepage Style) */}
        <main>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Inside this Collection
            </h2>
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              {collection.prompts?.length || 0} Items
            </span>
          </div>
          
          {/* Using Tailwind Columns for Masonry Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {collection.prompts?.map((prompt) => {
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
                          src={prompt.mediaUrl} 
                          alt={prompt.title}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Quick Zoom Button */}
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

                    {/* Hover Info Overlay Gradient */}
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
        </main>
      </div>
    </div>
  );
};

export default CollectionDetail;