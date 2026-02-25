import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Clock, User, Share2, Linkedin } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://sea-lion-app-33jh5.ondigitalocean.app/';
const BASE_URL = 'https://sea-lion-app-33jh5.ondigitalocean.app/';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${slug}`);
        setBlog(res.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--accent-green)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center card p-8 border-dashed">
          <p className="mb-4 text-lg" style={{ color: 'var(--text-secondary)' }}>Article not found</p>
          <Link to="/blog" className="font-medium hover:underline transition-colors" style={{ color: 'var(--accent-green)' }}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  const readingTime = blog.readingTime || Math.ceil(blog.content?.length / 1000) || 5;

  return (
    <div className="min-h-screen py-10 animate-fade-in pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>{blog.metaTitle || blog.title} | AI Prompt Library</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        <link rel="canonical" href={`${BASE_URL}/blog/${blog.slug}`} />
      </Helmet>

      {/* ✅ INCREASED MAX WIDTH TO 6XL FOR A MASSIVE, PREMIUM LAYOUT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white bg-[#12121a] px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>
        </nav>

        {/* Main Article Card */}
        <article className="card overflow-hidden shadow-2xl" style={{ border: '1px solid var(--border-light)' }}>
          
          {/* Cover Image - Fixed height, no overlaps */}
          <header className="w-full h-[30vh] sm:h-[40vh] md:h-[500px] relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
              loading="eager"
            />
          </header>

          {/* Article Content Wrapper - Massive padding for readability */}
          <div className="p-6 sm:p-10 md:p-16 lg:p-20" style={{ backgroundColor: 'var(--bg-card)' }}>
            
            <div className="max-w-4xl mx-auto">
              {/* Meta Information Bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm mb-8 font-medium" style={{ color: 'var(--text-muted)' }}>
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  {blog.category}
                </span>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.author}</span>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10 leading-tight tracking-tight text-white">
                {blog.title}
              </h1>

              {/* Excerpt Box */}
              {blog.excerpt && (
                <div className="mb-12 p-6 md:p-8 rounded-2xl border-l-4 shadow-inner" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderLeftColor: 'var(--accent-green)', borderRight: '1px solid var(--border-light)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                  <p className="text-lg md:text-xl italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    "{blog.excerpt}"
                  </p>
                </div>
              )}

              {/* Dynamic Content */}
              <div 
                className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:text-white prose-a:text-green-400 hover:prose-a:text-green-300"
                style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-16 pt-8 flex flex-wrap items-center gap-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <span className="text-sm font-bold uppercase tracking-wider mr-2" style={{ color: 'var(--text-primary)' }}>Tags:</span>
                  {blog.tags.filter(tag => tag.trim()).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Sharing Section */}
              <div className="mt-12 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Share this masterclass</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Help other creators discover these AI secrets.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${BASE_URL}/blog/${blog.slug}`)}
                    className="flex-1 sm:flex-none flex items-center justify-center p-4 rounded-xl transition-all hover-lift"
                    style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }}
                    title="Copy Link"
                  >
                    <Share2 size={20} />
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(`${BASE_URL}/blog/${blog.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center p-4 rounded-xl transition-all hover-lift"
                    style={{ backgroundColor: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    title="Share on X"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/blog/${blog.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center p-4 rounded-xl transition-all hover-lift"
                    style={{ backgroundColor: '#0A66C2', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    title="Share on LinkedIn"
                  >
                     <Linkedin size={20} fill="currentColor" strokeWidth={0} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;