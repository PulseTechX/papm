import React, { useState, useRef } from 'react';
import { Download, X, Star, Copy, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

const DownloadCard = ({ prompt, size = 'normal' }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      // Wait for image to load
      const img = cardRef.current.querySelector('img');
      if (img) {
        await new Promise((resolve, reject) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      }

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('📸 Capturing card...');

      // Capture the visible modal card
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#0f0f1a',
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 15000
      });

      console.log('✅ Canvas created:', canvas.width, 'x', canvas.height);

      // Download
      const link = document.createElement('a');
      link.download = `${prompt.title.replace(/\s+/g, '-').toLowerCase()}-prompt.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      console.log('✅ Download complete!');
      setShowModal(false);
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Failed to download: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const sizeClasses = {
    small: 'py-2 px-3 text-xs',
    normal: 'py-2.5 px-4 text-sm'
  };

  return (
    <>
      {/* Download Button */}
      <button
        onClick={openModal}
        disabled={isDownloading}
        className={`rounded-lg flex items-center justify-center gap-2 transition font-semibold bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
        title="Download as image card"
      >
        <Download size={size === 'small' ? 12 : 16} />
        {size === 'small' ? '' : 'Download'}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 transition"
            title="Close"
          >
            <X size={32} />
          </button>

          {/* Card Preview */}
          <div className="flex flex-col items-center gap-6 py-8">
            {/* The Card */}
            <div 
              ref={cardRef}
              className="w-[600px] bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20"
            >
              {/* Top Accent Bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              {/* Main Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">AI Prompt</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white leading-tight">{prompt.title}</h1>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-800/50 px-3 py-1.5 rounded-full">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-300 font-medium">{prompt.copyCount || 0}</span>
                    <span className="text-xs text-gray-500">copies</span>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-gray-700/50 shadow-lg">
                  <img 
                    src={prompt.mediaUrl} 
                    alt={prompt.title} 
                    className="w-full h-full object-cover" 
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Prompt Text Box */}
                <div className="bg-gray-800/40 backdrop-blur-sm p-5 rounded-2xl mb-6 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Copy size={14} className="text-blue-400" />
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Prompt</span>
                  </div>
                  <p className="text-gray-200 text-sm font-mono leading-relaxed">{prompt.promptText}</p>
                </div>

                {/* Tags - PERFECT CENTERED CAPSULES */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Details</span>
                  </div>
                  
                  {/* Tags Container */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* AI Model Tag */}
                    <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/30 to-blue-700/30 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-full min-w-[120px]">
                      <span className="text-base leading-none">🤖</span>
                      <span className="text-xs font-semibold leading-none">{prompt.aiModel}</span>
                    </div>
                    
                    {/* Industry Tag */}
                    <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/30 to-purple-700/30 border border-purple-500/40 text-purple-300 px-4 py-2 rounded-full min-w-[120px]">
                      <span className="text-base leading-none">🏢</span>
                      <span className="text-xs font-semibold leading-none">{prompt.industry}</span>
                    </div>
                    
                    {/* Topic Tag */}
                    <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600/30 to-pink-700/30 border border-pink-500/40 text-pink-300 px-4 py-2 rounded-full min-w-[120px]">
                      <span className="text-base leading-none">🏷️</span>
                      <span className="text-xs font-semibold leading-none">{prompt.topic}</span>
                    </div>
                    
                    {/* Trending Tag */}
                    {prompt.isTrending && (
                      <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600/30 to-yellow-700/30 border border-yellow-500/40 text-yellow-300 px-4 py-2 rounded-full min-w-[120px]">
                        <span className="text-base leading-none">🔥</span>
                        <span className="text-xs font-semibold leading-none">Trending</span>
                      </div>
                    )}
                    
                    {/* Prompt of Day Tag */}
                    {prompt.isPromptOfDay && (
                      <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600/30 to-orange-700/30 border border-orange-500/40 text-orange-300 px-4 py-2 rounded-full min-w-[120px]">
                        <span className="text-base leading-none">⭐</span>
                        <span className="text-xs font-semibold leading-none">Prompt of Day</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">PromptHeroClone</p>
                      <p className="text-xs text-gray-500">AI Prompt Library</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">promptapp.com</p>
                    <p className="text-xs text-gray-600">{new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadCard}
              disabled={isDownloading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg shadow-purple-900/30"
            >
              <Download size={20} />
              {isDownloading ? 'Downloading...' : 'Download High-Quality PNG'}
            </button>

            <p className="text-gray-500 text-xs">
              ✨ High-quality 3x scale • Perfect for sharing on social media
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadCard;