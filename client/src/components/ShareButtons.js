import React from 'react';
import { Copy, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import Toast from './Toast';

const ShareButtons = ({ prompt }) => {
  const [toast, setToast] = React.useState(null);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/prompt/${prompt._id}` 
    : '';

  const shareData = {
    title: `${prompt.title} - AI Prompt`,
    text: `Check out this ${prompt.aiModel} prompt: ${prompt.title}`,
    url: shareUrl
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setToast({ message: 'Link copied!', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareData.title)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition"
        title="Share"
      >
        <Share2 size={14} />
        <span className="hidden sm:inline">Share</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition"
        title="Copy Link"
      >
        <Copy size={14} />
        <span className="hidden sm:inline">Copy Link</span>
      </button>

      <button
        onClick={handleShareTwitter}
        className="p-1.5 bg-gray-700 hover:bg-blue-600 text-white text-xs rounded-lg transition"
        title="Share on Twitter"
      >
        <Twitter size={14} />
      </button>

      <button
        onClick={handleShareFacebook}
        className="p-1.5 bg-gray-700 hover:bg-blue-700 text-white text-xs rounded-lg transition"
        title="Share on Facebook"
      >
        <Facebook size={14} />
      </button>

      <button
        onClick={handleShareLinkedIn}
        className="p-1.5 bg-gray-700 hover:bg-blue-800 text-white text-xs rounded-lg transition"
        title="Share on LinkedIn"
      >
        <Linkedin size={14} />
      </button>
    </div>
  );
};

export default ShareButtons;