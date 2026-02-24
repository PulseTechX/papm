import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Terms of Service | AI Prompt Library</title>
      </Helmet>

      <div className="max-w-4xl mx-auto card p-8 md:p-12 text-gray-300 space-y-6">
        <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-white/10 pb-4">Terms of Service</h1>
        
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <h2 className="text-xl font-bold text-white mt-8">1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>

        <h2 className="text-xl font-bold text-white mt-8">2. Use of Prompts</h2>
        <p>All AI prompts provided on this website are free to copy, modify, and use for personal or commercial AI generation projects. You do not need to provide attribution, though it is appreciated. However, you may not mass-scrape or redistribute the database of prompts as your own standalone product.</p>

        <h2 className="text-xl font-bold text-white mt-8">3. Disclaimer of Warranties</h2>
        <p>The site and its contents are provided "as is". We make no warranties, expressed or implied, regarding the exact outputs you will get from third-party AI models (like Midjourney or DALL-E) when using these prompts, as AI models are constantly updating and changing.</p>

        <h2 className="text-xl font-bold text-white mt-8">4. Contact</h2>
        <p>If you have any questions regarding these terms, please contact us via the Contact page.</p>
      </div>
    </div>
  );
};

export default Terms;