import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Added Footer Import
import { Loader } from 'lucide-react';

// ⚡ NORMAL IMPORT: Load the Homepage immediately so it's blazing fast
import Gallery from './pages/Gallery';
import PromptDetail from './pages/PromptDetail';

// 🚀 LAZY IMPORTS: Load these ONLY when the user clicks on them!
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SavedPrompts = lazy(() => import('./pages/SavedPrompts'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AITools = lazy(() => import('./pages/AITools'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'));
const PromptGenerator = lazy(() => import('./pages/PromptGenerator'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const PromptEnhancer = lazy(() => import('./pages/PromptEnhancer'));
const NegativePromptGenerator = lazy(() => import('./pages/NegativePromptGenerator'));

// A sleek loading spinner to show while switching pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
    <div className="flex flex-col items-center gap-3">
      <Loader className="animate-spin text-blue-500" size={32} />
      <p className="text-sm font-medium text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const BASE_URL = 'https://sea-lion-app-33jh5.ondigitalocean.app/';

  return (
    <HelmetProvider>
      <Router>
        <a 
          href="#main-content" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        {/* ✅ Added flex and flex-col here to enable sticky footer pushing */}
        <div className="min-h-screen flex flex-col text-white font-sans selection:bg-primary-500/30">
          
          <Helmet>
            <title>AI Prompt Library - Free Midjourney & DALL-E Prompts</title>
            <meta name="description" content="Discover thousands of free AI prompts for Midjourney, DALL-E 3, Stable Diffusion. Browse by category, industry, and style. Download high-quality prompt templates." />
            <meta name="keywords" content="AI prompts, Midjourney prompts, DALL-E prompts, AI art, prompt library, free prompts, Stable Diffusion, Leonardo AI, AI image generation" />
            <meta name="author" content="AI Prompt Library" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={BASE_URL} />
            
            <meta property="og:type" content="website" />
            <meta property="og:url" content={BASE_URL} />
            <meta property="og:title" content="AI Prompt Library - Free AI Prompts for Midjourney, DALL-E & More" />
            <meta property="og:description" content="Discover thousands of free AI prompts for Midjourney, DALL-E 3, Stable Diffusion. Browse by category, industry, and style." />
            <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
            <meta property="og:site_name" content="AI Prompt Library" />
            
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={BASE_URL} />
            <meta property="twitter:title" content="AI Prompt Library - Free AI Prompts" />
            <meta property="twitter:description" content="Discover thousands of free AI prompts for Midjourney, DALL-E 3, Stable Diffusion." />
            <meta property="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
            
            <meta name="theme-color" content="#0a0a0f" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/logo192.png" />
          </Helmet>

          {/* ✅ Search props removed, Navbar is now purely for navigation */}
          <Navbar />
          
          {/* ✅ Added flex-grow so the main content pushes the footer to the bottom */}
          <main id="main-content" className="w-full flex-grow">
            {/* Suspense is required for Lazy Loading. It shows the PageLoader while the next page downloads. */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Instantly loaded routes */}
                <Route path="/" element={<Gallery />} />
                <Route path="/prompt/:slug" element={<PromptDetail />} />
                
                {/* Lazy loaded routes */}
                <Route path="/saved" element={<SavedPrompts />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:slug" element={<CollectionDetail />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/prompt-generator" element={<PromptGenerator />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/terms" element={<Terms />} />
				<Route path="/privacy" element={<Privacy />} />
				<Route path="/prompt-enhancer" element={<PromptEnhancer />} />
				<Route path="/negative-prompt" element={<NegativePromptGenerator />} />
              </Routes>
            </Suspense>
          </main>

          {/* ✅ The New Global Footer */}
          <Footer />

        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;