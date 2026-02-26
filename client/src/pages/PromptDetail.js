import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Copy, ArrowLeft, Star, TrendingUp, Clock, Eye, ZoomIn, Sparkles, ExternalLink, Mail, X } from 'lucide-react';
import { Facebook, Linkedin, MessageCircle } from 'lucide-react';
import Toast from '../components/Toast';
import CoffeeButton from '../components/CoffeeButton';
import AffiliateLink from '../components/AffiliateLink';
import SaveButton from '../components/SaveButton';

const API_URL = process.env.REACT_APP_API_URL || 'https://pickaprompt.com';
const BASE_URL = 'https://pickaprompt.com';

const PromptDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [relatedPrompts, setRelatedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState({ prompt: false, link: false, negative: false });
  const [toast, setToast] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/prompts/${slug}`);
        setPrompt(res.data);
        document.title = `${res.data.title} - AI Prompt | AI Prompt Library`;
      } catch (error) {
        setToast({ message: 'Prompt not found', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        // Simplify your PromptDetail.js to use the new hybrid route!
		const res = await axios.get(`${API_URL}/api/prompts/${slug}`);
        setRelatedPrompts(res.data);
      } catch (error) {
        console.error('Error fetching related:', error);
      }
    };

    fetchPrompt();
    fetchRelated();
  }, [slug]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setToast({ message: `${type === 'link' ? 'Link' : 'Prompt'} copied!`, type: 'success' });
      
      if (type === 'prompt') {
        setPrompt(prev => ({
          ...prev,
          copyCount: (prev.copyCount || 0) + 1
        }));
        await axios.post(`${API_URL}/api/prompts/${prompt._id}/copy`);
      }
      
    } catch (error) {
      setToast({ message: 'Failed to copy', type: 'error' });
    }

    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    setTimeout(() => setToast(null), 2000);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(`${BASE_URL}/prompt/${prompt.slug || slug}`);
    const text = encodeURIComponent(`${prompt.title} - Check out this ${prompt.aiModel} prompt!`);
    const image = encodeURIComponent(prompt.mediaUrl);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${text}`,
      mail: `mailto:?subject=${text}&body=Check out this prompt: ${url}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--primary-500)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading prompt details...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center card p-8 border-dashed">
          <p className="mb-4 text-lg" style={{ color: 'var(--text-secondary)' }}>Prompt not found</p>
          <Link to="/" className="font-medium hover:underline transition-colors" style={{ color: 'var(--primary-400)' }}>Back to Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>{prompt.title} - {prompt.aiModel} AI Prompt | AI Prompt Library</title>
        <meta name="description" content={`${prompt.description || prompt.promptText.substring(0, 150)}...`} />
        <meta name="keywords" content={`${prompt.aiModel} prompts, ${prompt.topic} prompts, ${prompt.industry} AI art, ${prompt.title}, free AI prompts`} />
        <meta name="author" content="AI Prompt Library" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE_URL}/prompt/${prompt.slug || slug}`} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${BASE_URL}/prompt/${prompt.slug || slug}`} />
        <meta property="og:title" content={`${prompt.title} - ${prompt.aiModel} AI Prompt`} />
        <meta property="og:description" content={prompt.description || prompt.promptText.substring(0, 200)} />
        <meta property="og:image" content={prompt.mediaUrl} />
        <meta property="og:site_name" content="AI Prompt Library" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${BASE_URL}/prompt/${prompt.slug || slug}`} />
        <meta property="twitter:title" content={`${prompt.title} - ${prompt.aiModel} AI Prompt`} />
        <meta property="twitter:description" content={prompt.description || prompt.promptText.substring(0, 200)} />
        <meta property="twitter:image" content={prompt.mediaUrl} />
        
        <meta name="theme-color" content="#0a0a0f" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "headline": prompt.title,
            "description": prompt.description || prompt.promptText.substring(0, 200),
            "image": prompt.mediaUrl,
            "author": {
              "@type": "Organization",
              "name": "AI Prompt Library",
              "url": BASE_URL
            },
            "datePublished": prompt.createdAt,
            "dateModified": prompt.updatedAt || prompt.createdAt,
            "keywords": [prompt.aiModel, prompt.topic, prompt.industry].filter(Boolean),
            "articleBody": prompt.promptText,
            "publisher": {
              "@type": "Organization",
              "name": "AI Prompt Library",
              "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/logo192.png`
              }
            },
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": "http://schema.org/DownloadAction",
              "userInteractionCount": prompt.copyCount || 0
            }
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
                "name": "Prompts",
                "item": `${BASE_URL}/`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": prompt.title,
                "item": `${BASE_URL}/prompt/${prompt.slug || slug}`
              }
            ]
          })}
        </script>
      </Helmet>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Full Image Modal (Matching Homepage Lightbox) */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowFullImage(false)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)' }}
            onClick={() => setShowFullImage(false)}
            aria-label="Close image viewer"
          >
            <X size={24} />
          </button>
          <img 
            src={prompt.mediaUrl} 
            alt={prompt.title} 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-glow-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Back Button Nav */}
      <nav className="py-6 px-4 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 transition-colors text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          <span>Back to Gallery</span>
        </button>
      </nav>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ============================================
              🖼️ LEFT COLUMN: IMAGE & PROMPT DETAILS
              ============================================ */}
          <article className="lg:col-span-8 space-y-8">
            
            {/* Main Image/Video Card */}
            <div className="card overflow-hidden">
              <div className="relative flex items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {prompt.mediaType === 'video' ? (
                  <video 
                    src={prompt.mediaUrl} 
                    controls 
                    className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <img 
                      src={prompt.mediaUrl} 
                      alt={`${prompt.title} - ${prompt.aiModel} ${prompt.topic} AI generated`}
                      className="w-full h-auto max-h-[75vh] object-contain rounded-lg cursor-zoom-in"
                      loading="lazy"
                      onClick={() => setShowFullImage(true)}
                    />
                    <button 
                      className="absolute top-6 right-6 p-3 rounded-xl transition-all shadow-lg hover-lift"
                      style={{ backgroundColor: 'rgba(26, 26, 37, 0.8)', backdropFilter: 'blur(8px)', color: 'var(--text-primary)' }}
                      onClick={() => setShowFullImage(true)}
                      aria-label="View full size image"
                      title="Click to zoom"
                    >
                      <ZoomIn size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image Info Bar */}
              <div className="p-5 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-light)' }}>
                <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-2">
                    <Eye size={16} style={{ color: 'var(--text-muted)' }} />
                    {prompt.copyCount || 0} copies
                  </span>
                  <span className="flex items-center gap-2 hidden sm:flex">
                    <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                    {new Date(prompt.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className="badge badge-primary text-xs tracking-wide font-bold uppercase">{prompt.aiModel}</span>
              </div>
            </div>

            {/* Prompt & Details Section */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Sparkles size={20} style={{ color: 'var(--primary-400)' }} />
                Prompt Details
              </h2>
              
              {/* Main Prompt */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Prompt</h3>
                  <button
                    onClick={() => copyToClipboard(prompt.promptText, 'prompt')}
                    className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-semibold hover-lift"
                    style={{ 
                      backgroundColor: copied.prompt ? 'var(--accent-green)' : 'rgba(59, 130, 246, 0.15)',
                      color: copied.prompt ? '#fff' : 'var(--primary-400)'
                    }}
                  >
                    <Copy size={14} />
                    {copied.prompt ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                  <p className="font-mono text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {prompt.promptText}
                  </p>
                </div>
              </div>

              {/* Negative Prompt */}
              {prompt.negativePrompt && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Negative Prompt</h3>
                    <button
                      onClick={() => copyToClipboard(prompt.negativePrompt, 'negative')}
                      className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-semibold hover-lift"
                      style={{ 
                        backgroundColor: copied.negative ? 'var(--accent-green)' : 'var(--bg-hover)',
                        color: copied.negative ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      <Copy size={14} />
                      {copied.negative ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-5 rounded-xl border border-dashed" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-medium)' }}>
                    <p className="font-mono text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {prompt.negativePrompt}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {prompt.description && (
                <div className="pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Notes</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{prompt.description}</p>
                </div>
              )}
            </div>

            {/* Related Prompts Grid */}
            {relatedPrompts.length > 0 && (
              <div className="pt-4">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  More Inspiration
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedPrompts.map((related) => (
                    <Link
                      key={related._id}
                      to={`/prompt/${related.slug || related._id}`}
                      className="group block overflow-hidden card hover-lift"
                    >
                      <div className="aspect-square w-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <img 
                          src={related.mediaUrl} 
                          alt={related.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ============================================
              📲 RIGHT COLUMN: SIDEBAR & ACTIONS
              ============================================ */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Title & Badges */}
            <div className="card p-6">
              <h1 className="text-2xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>{prompt.title}</h1>
              <div className="flex flex-wrap gap-2">
                {prompt.isTrending && (
                  <span className="badge badge-yellow text-xs px-3 py-1.5" style={{ background: 'linear-gradient(135deg, var(--accent-yellow) 0%, #ea580c 100%)', color: '#fff', border: 'none' }}>
                    <Sparkles size={12} />
                    Trending Now
                  </span>
                )}
                {prompt.isPromptOfDay && (
                  <span className="badge badge-purple text-xs px-3 py-1.5">
                    <Star size={12} fill="currentColor" />
                    Prompt of the Day
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 border-glow">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: 'var(--text-secondary)' }}>Quick Actions</h3>
              
              {/* Main Copy Button */}
              <button
                onClick={() => copyToClipboard(prompt.promptText, 'prompt')}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-base mb-4 hover-lift ${
                  copied.prompt ? '' : 'gradient-primary shadow-glow-primary'
                }`}
                style={{
                  backgroundColor: copied.prompt ? 'var(--accent-green)' : 'transparent',
                  color: '#ffffff'
                }}
              >
                <Copy size={20} />
                {copied.prompt ? 'Prompt Copied!' : 'Copy Prompt'}
              </button>
              
              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SaveButton promptId={prompt._id} size="medium" />
                
                <button
                  onClick={() => copyToClipboard(`${BASE_URL}/prompt/${prompt.slug || slug}`, 'link')}
                  className="py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm hover-lift"
                  style={{
                    backgroundColor: copied.link ? 'var(--accent-green)' : 'var(--bg-hover)',
                    color: copied.link ? '#fff' : 'var(--text-primary)',
                    border: copied.link ? 'none' : '1px solid var(--border-light)'
                  }}
                >
                  <ExternalLink size={16} />
                  {copied.link ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              
              {/* Social Share Grid */}
              <div className="pt-5" style={{ borderTop: '1px solid var(--border-light)' }}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Share on Social</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="py-2.5 rounded-lg flex items-center justify-center transition-transform hover-lift bg-[#000000] text-white"
                    title="Share on X"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="py-2.5 rounded-lg flex items-center justify-center transition-transform hover-lift bg-[#1877F2] text-white"
                    title="Share on Facebook"
                  >
                    <Facebook size={18} fill="currentColor" strokeWidth={0} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="py-2.5 rounded-lg flex items-center justify-center transition-transform hover-lift bg-[#0A66C2] text-white"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={18} fill="currentColor" strokeWidth={0} />
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="py-2.5 rounded-lg flex items-center justify-center transition-transform hover-lift bg-[#25D366] text-white"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle size={18} fill="currentColor" strokeWidth={0} />
                  </button>
                  <button
                    onClick={() => handleShare('pinterest')}
                    className="py-2.5 rounded-lg flex items-center justify-center transition-transform hover-lift bg-[#E60023] text-white"
                    title="Share on Pinterest"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                  </button>
                  <button
                    onClick={() => handleShare('mail')}
                    className="py-2.5 rounded-lg flex items-center justify-center transition-colors hover-lift"
                    style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}
                    title="Share via Email"
                  >
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Categories & Metadata */}
            <div className="card p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>Categories</h3>
              <div className="space-y-3">
                <Link 
                  to={`/?topic=${prompt.topic}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <span className="text-lg">🏷️</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Style / Topic</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{prompt.topic}</p>
                  </div>
                </Link>
                
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>AI Model</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--primary-400)' }}>{prompt.aiModel}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <span className="text-lg">🏢</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Industry</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{prompt.industry}</p>
                  </div>
                </div>
              </div>
              
              {/* Affiliate Link Component */}
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border-light)' }}>
                <AffiliateLink aiModel={prompt.aiModel} />
              </div>
            </div>

            {/* Support / Coffee */}
            <div className="rounded-2xl p-6 text-center shadow-glow-yellow" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--accent-yellow)' }}>☕ Enjoying these free prompts?</p>
              <div className="flex justify-center">
                <CoffeeButton size="small" />
              </div>
            </div>

          </aside>
        </div>

        {/* Bottom Ad Banner Placeholder */}
        <section className="mt-16">
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-light)' }}>
            <div className="h-32 sm:h-48 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PromptDetail;