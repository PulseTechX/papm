import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://client-theta-coral.vercel.app';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blogs`);
      // Filter only published blogs
      setBlogs(res.data.filter(blog => blog.isPublished));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--accent-green)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 animate-fade-in pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ============================================
          🎯 SEO META TAGS FOR BLOG LIST PAGE
          ============================================ */}
      <Helmet>
        {/* Primary SEO Tags */}
        <title>AI Art Blog - Tutorials & Tips | AI Prompt Library</title>
        <meta name="description" content="Learn AI art techniques, prompt engineering tips, and tutorials for Midjourney, DALL-E, and Stable Diffusion. Expert guides for AI creators." />
        <meta name="keywords" content="AI art blog, prompt engineering, Midjourney tutorials, DALL-E tips, Stable Diffusion guides, AI art tutorials, prompt library blog" />
        <meta name="author" content="AI Prompt Library" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE_URL}/blog`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/blog`} />
        <meta property="og:title" content="AI Art Blog - Tutorials & Tips" />
        <meta property="og:description" content="Learn AI art techniques, prompt engineering tips, and tutorials for Midjourney, DALL-E, and Stable Diffusion." />
        <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
        <meta property="og:site_name" content="AI Prompt Library" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${BASE_URL}/blog`} />
        <meta property="twitter:title" content="AI Art Blog - Tutorials & Tips" />
        <meta property="twitter:description" content="Learn AI art techniques, prompt engineering tips, and tutorials." />
        <meta property="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
        
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#0a0a0f" />
        
        {/* Structured Data (Schema.org JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "AI Prompt Library Blog",
            "url": `${BASE_URL}/blog`,
            "description": "Learn AI art techniques, prompt engineering tips, and tutorials for Midjourney, DALL-E, and Stable Diffusion.",
            "publisher": {
              "@type": "Organization",
              "name": "AI Prompt Library",
              "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/logo192.png`
              }
            },
            "blogPost": blogs.slice(0, 10).map(blog => ({
              "@type": "BlogPosting",
              "headline": blog.title,
              "url": `${BASE_URL}/blog/${blog.slug}`,
              "image": blog.ogImage || blog.coverImage,
              "datePublished": blog.publishedAt || blog.createdAt,
              "author": {
                "@type": "Person",
                "name": blog.author
              }
            }))
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Premium Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <BookOpen size={14} style={{ color: 'var(--accent-green)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-green)' }}>Articles & Guides</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            Master the Art of <span style={{ color: 'var(--accent-green)' }}>AI</span>
          </h1>
          <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Expert tutorials, prompt engineering secrets, and the latest trends in generative AI.
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-20 card border-dashed max-w-2xl mx-auto">
            <Sparkles size={48} className="mx-auto mb-4" style={{ color: 'var(--border-medium)' }} />
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {blogs.map((blog) => (
              <article key={blog._id} className="h-full">
                <Link
                  to={`/blog/${blog.slug}`}
                  className="group flex flex-col h-full card overflow-hidden hover-lift transition-all duration-300"
                  style={{ border: '1px solid var(--border-light)' }}
                  aria-label={`Read ${blog.title}`}
                >
                  <div className="aspect-[16/10] overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md" style={{ backgroundColor: 'rgba(10, 10, 15, 0.7)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 transition-colors duration-300" style={{ color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                      {blog.title}
                    </h2>
                    <p className="text-sm line-clamp-3 mb-6 flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-5 mt-auto" style={{ borderTop: '1px solid var(--border-light)' }}>
                      <div className="flex items-center gap-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <time dateTime={blog.createdAt}>
                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{blog.readingTime || Math.ceil(blog.content?.length / 1000)} min read</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full transition-colors group-hover:bg-white/5" style={{ color: 'var(--accent-green)' }}>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default BlogList;