import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Mail, Sparkles, ImageIcon, FolderHeart, Wrench, BookOpen, RefreshCw, ShieldAlert, Cpu, Wand2 } from 'lucide-react';
import CoffeeButton from './CoffeeButton';

const Footer = () => {
  return (
    <footer className="w-full border-t mt-auto relative overflow-hidden" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Column 1: Brand & Description (Spans 5 columns on large screens) */}
          <div className="md:col-span-12 lg:col-span-5 pr-4 lg:pr-8">
            <Link to="/" className="inline-block mb-5 hover:opacity-90 transition-opacity">
              <span className="text-3xl font-extrabold gradient-text tracking-tight whitespace-nowrap">
                PickAPrompt
              </span>
            </Link>
            <p className="text-sm mb-8 leading-relaxed max-w-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Your ultimate destination to discover, generate, and share master-level AI prompts for Midjourney, DALL-E 3, Stable Diffusion, and state-of-the-art video models.
            </p>
            <div className="flex flex-col items-start gap-3">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Support the project</span>
              <CoffeeButton size="small" />
            </div>
          </div>

          {/* Column 2: AI Tools (Spans 2 columns) */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Cpu size={16} style={{ color: 'var(--primary-400)' }} /> AI Tools
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/prompt-generator" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <Wand2 size={14} className="group-hover:text-blue-400 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Prompt Generator</span>
                  <span className="ml-auto text-[9px] py-0.5 px-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">FREE</span>
                </Link>
              </li>
              <li>
                <Link to="/prompt-enhancer" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <RefreshCw size={14} className="group-hover:text-purple-400 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Prompt Enhancer</span>
                  <span className="ml-auto text-[9px] py-0.5 px-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">FREE</span>
                </Link>
              </li>
              <li>
                <Link to="/negative-prompt" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <ShieldAlert size={14} className="group-hover:text-red-400 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Negative Prompt</span>
                  <span className="ml-auto text-[9px] py-0.5 px-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">FREE</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Discover (Spans 3 columns) */}
          <div className="md:col-span-4 lg:col-span-3 lg:pl-4">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Sparkles size={16} style={{ color: 'var(--accent-yellow)' }} /> Discover
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <ImageIcon size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-white transition-all" />
                  <span className="group-hover:translate-x-1 transition-transform">Prompt Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/collections" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <FolderHeart size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-white transition-all" />
                  <span className="group-hover:translate-x-1 transition-transform">Curated Collections</span>
                </Link>
              </li>
              <li>
                <Link to="/ai-tools" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <Wrench size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-white transition-all" />
                  <span className="group-hover:translate-x-1 transition-transform">AI Tools Directory</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <BookOpen size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-white transition-all" />
                  <span className="group-hover:translate-x-1 transition-transform">Blog & Tutorials</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect & Legal (Spans 2 columns) */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Mail size={16} style={{ color: 'var(--accent-purple)' }} /> Connect
            </h3>
            <ul className="space-y-4 text-sm font-medium mb-8">
              <li>
                <a href="#" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <Twitter size={14} className="text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-1 transition-transform">Twitter / X</span>
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <Github size={14} className="opacity-70 group-hover:opacity-100 transition-opacity text-gray-300" />
                  <span className="group-hover:translate-x-1 transition-transform">GitHub</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center gap-2 transition-all hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={14} className="text-purple-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium" style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} PickAPrompt. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link to="/about" className="hover:text-white transition-colors relative group">
              About US
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors relative group">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors relative group">
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;