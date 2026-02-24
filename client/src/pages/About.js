import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, User, Code, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>About Us | AI Prompt Library</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">About <span className="gradient-text">Us</span></h1>
        </div>

        <div className="card p-8 md:p-12 leading-relaxed space-y-6 text-gray-300 shadow-glow-primary">
          <p className="text-lg text-white font-medium flex items-center gap-2 mb-2">
            <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><User size={20} /></span>
            Hi, I'm Viv k!
          </p>
          <p>
            Welcome to my AI Prompt Library. I created this platform because I am deeply passionate about the world of AI generation—from creating stunning surreal art to engineering highly detailed cinematic video prompts.
          </p>
          <p>
            As a solo creator and developer, I found myself constantly searching for high-quality, reliable prompts that actually worked. I realized that the AI community needed a clean, organized, and free space to share the best prompts for Midjourney, DALL-E, and Stable Diffusion. That's how this website was born.
          </p>
          <p>
            Everything you see here is designed, coded, and curated by me. My goal is to help you bypass the trial-and-error phase and jump straight into creating masterpieces.
          </p>
          
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm font-medium">
            <span className="flex items-center gap-2"><Code size={16} className="text-purple-400" /> Image And Video Prompts</span>
            <span className="flex items-center gap-2"><Heart size={16} className="text-red-400" /> Made for the AI Community</span>
            <span className="flex items-center gap-2"><Sparkles size={16} className="text-yellow-400" /> Free to use forever</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;