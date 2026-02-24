import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Folder, Zap, BookOpen, Wand2, RefreshCw, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className="sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300"
      style={{ 
        backgroundColor: 'rgba(10, 10, 15, 0.8)', 
        borderColor: 'var(--border-light)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between gap-4 py-3">
        
        {/* Left: Logo */}
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-extrabold gradient-text tracking-tight whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          PickAPrompt
        </Link>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-1.5">
          <Link 
            to="/" 
            className="text-sm transition-all font-semibold whitespace-nowrap px-3.5 py-2 rounded-xl flex items-center gap-2"
            style={{
              color: isActive('/') ? '#fff' : 'var(--text-secondary)',
              backgroundColor: isActive('/') ? 'var(--bg-hover)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { if(!isActive('/')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            Gallery
          </Link>

          <Link 
            to="/saved" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/saved') ? 'var(--accent-red)' : 'var(--text-secondary)',
              backgroundColor: isActive('/saved') ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-red)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/saved')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <Heart size={16} />
            <span className="hidden lg:inline">Saved</span>
          </Link>

          <Link 
            to="/collections" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/collections') ? 'var(--accent-purple)' : 'var(--text-secondary)',
              backgroundColor: isActive('/collections') ? 'rgba(168, 85, 247, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-purple)'; e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/collections')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <Folder size={16} />
            <span className="hidden lg:inline">Collections</span>
          </Link>

          {/* PROMPT GENERATOR LINK */}
          <Link 
            to="/prompt-generator" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/prompt-generator') ? 'var(--primary-400)' : 'var(--text-secondary)',
              backgroundColor: isActive('/prompt-generator') ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-400)'; e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/prompt-generator')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <Wand2 size={16} />
            <span className="hidden xl:inline">Generator</span>
          </Link>

          {/* PROMPT ENHANCER LINK */}
          <Link 
            to="/prompt-enhancer" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/prompt-enhancer') ? '#ec4899' : 'var(--text-secondary)',
              backgroundColor: isActive('/prompt-enhancer') ? 'rgba(236, 72, 153, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ec4899'; e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/prompt-enhancer')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <RefreshCw size={16} />
            <span className="hidden xl:inline">Enhancer</span>
          </Link>

          {/* NEGATIVE PROMPT LINK */}
          <Link 
            to="/negative-prompt" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/negative-prompt') ? '#ef4444' : 'var(--text-secondary)',
              backgroundColor: isActive('/negative-prompt') ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/negative-prompt')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <ShieldAlert size={16} />
            <span className="hidden xl:inline">Negative Pro</span>
          </Link>

          {/* AI TOOLS LINK */}
          <Link 
            to="/ai-tools" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/ai-tools') ? 'var(--accent-yellow)' : 'var(--text-secondary)',
              backgroundColor: isActive('/ai-tools') ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-yellow)'; e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/ai-tools')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <Zap size={16} />
            <span className="hidden xl:inline">AI Tools</span>
          </Link>

          <Link 
            to="/blog" 
            className="text-sm transition-all font-semibold whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              color: isActive('/blog') ? 'var(--accent-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/blog') ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-green)'; e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'; }}
            onMouseLeave={(e) => { if(!isActive('/blog')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
          >
            <BookOpen size={16} />
            <span className="hidden xl:inline">Blog</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Links - Scrollable Row */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <Link to="/" className="text-xs font-semibold whitespace-nowrap px-3 py-2 rounded-lg" style={{ color: isActive('/') ? '#fff' : 'var(--text-secondary)', backgroundColor: isActive('/') ? 'var(--bg-hover)' : 'var(--bg-secondary)' }}>
            Gallery
          </Link>
          <Link to="/saved" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/saved') ? 'var(--accent-red)' : 'var(--text-secondary)', backgroundColor: isActive('/saved') ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)' }}>
            <Heart size={12} /> Saved
          </Link>
          <Link to="/collections" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/collections') ? 'var(--accent-purple)' : 'var(--text-secondary)', backgroundColor: isActive('/collections') ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-secondary)' }}>
            <Folder size={12} /> Collections
          </Link>
          <Link to="/prompt-generator" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/prompt-generator') ? 'var(--primary-400)' : 'var(--text-secondary)', backgroundColor: isActive('/prompt-generator') ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)' }}>
            <Wand2 size={12} /> Generator
          </Link>
          <Link to="/prompt-enhancer" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/prompt-enhancer') ? '#ec4899' : 'var(--text-secondary)', backgroundColor: isActive('/prompt-enhancer') ? 'rgba(236, 72, 153, 0.1)' : 'var(--bg-secondary)' }}>
            <RefreshCw size={12} /> Enhancer
          </Link>
          <Link to="/negative-prompt" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/negative-prompt') ? '#ef4444' : 'var(--text-secondary)', backgroundColor: isActive('/negative-prompt') ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)' }}>
            <ShieldAlert size={12} /> Negative Pro
          </Link>
          <Link to="/ai-tools" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/ai-tools') ? 'var(--accent-yellow)' : 'var(--text-secondary)', backgroundColor: isActive('/ai-tools') ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-secondary)' }}>
            <Zap size={12} /> AI Tools
          </Link>
          <Link to="/blog" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: isActive('/blog') ? 'var(--accent-green)' : 'var(--text-secondary)', backgroundColor: isActive('/blog') ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)' }}>
            <BookOpen size={12} /> Blog
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;