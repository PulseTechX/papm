import React from 'react';
import { ExternalLink } from 'lucide-react';

const AffiliateLink = ({ aiModel }) => {
  // ⚠️ REPLACE THESE WITH YOUR ACTUAL AFFILIATE LINKS
  const affiliateLinks = {
    'Midjourney': 'https://midjourney.com/?ref=YOUR_AFFILIATE_ID',
    'DALL-E 3': 'https://openai.com/dall-e-3?ref=YOUR_AFFILIATE_ID',
    'Stable Diffusion': 'https://stability.ai/?ref=YOUR_AFFILIATE_ID',
    'Runway Gen-2': 'https://runwayml.com/?ref=YOUR_AFFILIATE_ID',
    'Gemini': 'https://gemini.google.com/?ref=YOUR_AFFILIATE_ID',
    'ChatGPT': 'https://chat.openai.com/?ref=YOUR_AFFILIATE_ID'
  };

  const link = affiliateLinks[aiModel];

  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition mt-1"
    >
      <span>Get {aiModel}</span>
      <ExternalLink size={10} />
    </a>
  );
};

export default AffiliateLink;