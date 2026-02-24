import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Send, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Replace with your Web3Forms Access Key
    formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY");

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      setSubmitted(true);
      e.target.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Contact Us | AI Prompt Library</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 bg-blue-500/10 text-blue-400">
            <Mail size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-400">Have a question, feedback, or a cool prompt to share? Send me a message!</p>
        </div>

        <div className="card p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-12 animate-fade-in">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
              <p className="text-gray-400">Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Optional: Prevents spam */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Your Name</label>
                  <input type="text" name="name" required className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
                  <input type="email" name="email" required className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Message</label>
                <textarea name="message" required rows="5" className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition-colors resize-none" placeholder="What's on your mind?"></textarea>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all shadow-glow-primary hover-lift flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--primary-600)' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;