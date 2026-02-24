import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Privacy Policy | AI Prompt Library</title>
      </Helmet>

      <div className="max-w-4xl mx-auto card p-8 md:p-12 text-gray-300 space-y-6">
        <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-white/10 pb-4">Privacy Policy</h1>
        
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
        <p>We believe in keeping your data safe. We only collect the minimal information necessary for the website to function. If you contact us, we collect your name and email to reply to your inquiry. We may use standard analytics tools to see which prompts are the most popular.</p>

        <h2 className="text-xl font-bold text-white mt-8">2. How We Use Information</h2>
        <p>Any information collected is used solely to improve the user experience, fix bugs, and provide you with better AI prompts. <strong>We do not sell, trade, or rent your personal information to third parties.</strong></p>

        <h2 className="text-xl font-bold text-white mt-8">3. Cookies</h2>
        <p>We may use "cookies" to enhance your experience (such as remembering your saved prompts or filter preferences). You can choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.</p>

        <h2 className="text-xl font-bold text-white mt-8">4. Third-Party Links</h2>
        <p>Our website may contain links to third-party tools (like AI generation models). We have no control over the privacy policies of those sites and encourage you to review them.</p>
      </div>
    </div>
  );
};

export default Privacy;