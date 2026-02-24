import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Folder, Eye, Sparkles } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://client-theta-coral.vercel.app';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/collections`);
      // Filter only published collections
      setCollections(res.data.filter(collection => collection.isPublished));
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--accent-purple)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 animate-fade-in pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ============================================
          🎯 SEO META TAGS FOR COLLECTIONS PAGE
          ============================================ */}
      <Helmet>
        {/* Primary SEO Tags */}
        <title>AI Prompt Collections - Curated Libraries | AI Prompt Library</title>
        <meta name="description" content="Browse curated collections of AI prompts organized by category, style, and industry. Find the perfect prompt bundles for Midjourney, DALL-E, and Stable Diffusion." />
        <meta name="keywords" content="AI prompt collections, curated prompts, Midjourney collections, DALL-E bundles, Stable Diffusion libraries, prompt bundles, AI art collections" />
        <meta name="author" content="AI Prompt Library" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE_URL}/collections`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/collections`} />
        <meta property="og:title" content="AI Prompt Collections - Curated Libraries" />
        <meta property="og:description" content="Browse curated collections of AI prompts organized by category, style, and industry." />
        <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
        <meta property="og:site_name" content="AI Prompt Library" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${BASE_URL}/collections`} />
        <meta property="twitter:title" content="AI Prompt Collections - Curated Libraries" />
        <meta property="twitter:description" content="Browse curated collections of AI prompts organized by category, style, and industry." />
        <meta property="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
        
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#0a0a0f" />
        
        {/* Structured Data (Schema.org JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "AI Prompt Collections",
            "url": `${BASE_URL}/collections`,
            "description": "Browse curated collections of AI prompts organized by category, style, and industry.",
            "publisher": {
              "@type": "Organization",
              "name": "AI Prompt Library",
              "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/logo192.png`
              }
            },
            "hasPart": collections.slice(0, 10).map(collection => ({
              "@type": "CreativeWork",
              "name": collection.title,
              "url": `${BASE_URL}/collections/${collection.slug}`,
              "image": collection.coverImage,
              "description": collection.description
            }))
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Premium Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
            <Folder size={14} style={{ color: 'var(--accent-purple)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-purple)' }}>Curated Bundles</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            Premium <span style={{ color: 'var(--accent-purple)' }}>Collections</span>
          </h1>
          <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Hand-picked prompt bundles organized by style, industry, and use-case to supercharge your workflow.
          </p>
        </header>

        {collections.length === 0 ? (
          <div className="text-center py-20 card border-dashed max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <Folder size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-lg font-medium text-white mb-2">No collections built yet.</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Check back soon for curated prompt bundles!</p>
          </div>
        ) : (
          <main className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {collections.map((collection) => (
              <article key={collection._id} className="mb-8 break-inside-avoid">
                <Link
                  to={`/collections/${collection.slug}`}
                  className="group flex flex-col h-fit card overflow-hidden hover-lift transition-all duration-300"
                  style={{ border: '1px solid var(--border-light)' }}
                  aria-label={`View ${collection.title} collection`}
                >
                  <div className="relative w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <img
                      src={collection.coverImage}
                      alt={`${collection.title} - ${collection.category} AI prompt collection cover`}
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-105 block"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md" style={{ backgroundColor: 'rgba(10, 10, 15, 0.7)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {collection.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 bg-bg-card relative z-20">
                    <h2 className="text-xl font-bold mb-3 line-clamp-1 transition-colors duration-300" style={{ color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-purple)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                      {collection.title}
                    </h2>
                    <p className="text-sm line-clamp-2 mb-6 flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-5 mt-auto" style={{ borderTop: '1px solid var(--border-light)' }}>
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--accent-purple)' }}>
                          <Folder size={14} />
                          <span>{collection.prompts?.length || 0} Prompts</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye size={14} />
                          <span>{collection.views || 0} Views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </main>
        )}

        {/* Newsletter Signup Section */}
        <NewsletterSection />

      </div>
    </div>
  );
};

// Newsletter Component
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setSubscribed(true);
    setEmail('');
    
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="mt-20 p-8 md:p-12 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }} aria-label="Newsletter signup">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-primary-600/10 blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="text-center max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-full mb-6" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
          <Sparkles size={24} style={{ color: 'var(--accent-purple)' }} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Get Premium Prompts Weekly
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
          Join 5,000+ creators getting 5 hand-crafted, production-ready prompts delivered to their inbox every single week.
        </p>
        
        {subscribed ? (
          <div className="px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-medium animate-fade-in" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)' }} role="alert">
            <span className="text-xl">✨</span> Thanks for subscribing! Check your inbox soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" aria-label="Newsletter subscription form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              className="flex-1 px-5 py-3.5 rounded-xl outline-none text-sm transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover-lift"
              style={{ backgroundColor: 'var(--accent-purple)', color: '#fff', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
              aria-label="Subscribe to newsletter"
            >
              Subscribe Free
            </button>
          </form>
        )}
        
        <p className="text-xs mt-6 uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Collections;