import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, BookOpen, Image, LogOut, Folder, AlertCircle, CheckCircle, Loader, Plus, PlusCircle, Upload, Search, Settings, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const ADMIN_KEY = 'MySuperSecretPassword1234';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

const CATEGORY_STRUCTURE = {
  'Media Type': ['Image', 'Video'],
  'AI Model': ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Runway Gen-2', 'Gemini', 'ChatGPT', 'Grok', 'Claude', 'Leonardo AI', 'Nano Banana'],
  'Industry': ['Real Estate', 'Entertainment', 'Marketing', 'Gaming', 'Fashion', 'Education', 'Healthcare', 'Finance', 'Technology'],
  'Style': ['Portrait', 'Landscape', 'Logo', 'Abstract', 'Photorealistic', 'Artistic', 'Minimalist', 'Cyberpunk', 'Fantasy']
};

const COLLECTION_CATEGORIES = [
  'Logo Design', 'Social Media', 'Real Estate', 'Gaming', 'Fashion',
  'Portrait', 'Landscape', 'Abstract Art', '3D Render', 'Anime',
  'Marketing', 'Education', 'Music', 'Video Content', 'Writing'
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('prompts');
  const [prompts, setPrompts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', promptText: '', negativePrompt: '',
    aiModel: 'Midjourney', industry: 'Marketing', topic: 'Logo',
    mediaType: 'image', isTrending: false, isPromptOfDay: false
  });
  const [blogData, setBlogData] = useState({
    title: '', slug: '', excerpt: '', content: '',
    author: 'Admin', category: 'Tutorial', tags: '', isPublished: false,
    metaTitle: '', metaDescription: '', focusKeyword: '', seoKeywords: '', canonicalUrl: ''
  });
  const [collectionData, setCollectionData] = useState({
    title: '', slug: '', description: '', category: 'Logo Design',
    prompts: [], isPublished: false
  });
  const [file, setFile] = useState(null);
  const [blogFile, setBlogFile] = useState(null);
  const [collectionFile, setCollectionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
          const { token, expiry } = JSON.parse(sessionData);
          if (token === ADMIN_KEY && Date.now() < expiry) {
            setAuthorized(true);
            console.log('✅ Session valid');
          } else {
            localStorage.removeItem('adminSession');
            console.log('⚠️ Session expired');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('adminSession');
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (checkingAuth) return;
    if (authorized) return;
    const password = window.prompt("🔒 Admin Access Only\nEnter Password:");
    if (password === ADMIN_KEY) {
      const sessionData = { token: ADMIN_KEY, expiry: Date.now() + SESSION_DURATION };
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      setAuthorized(true);
      showToast('✅ Authorized successfully!', 'success');
    } else if (password !== null) {
      showToast("❌ Wrong Password! Redirecting...", 'error');
      setTimeout(() => { window.location.href = "/"; }, 2000);
    }
  }, [checkingAuth, authorized]);

  useEffect(() => {
    if (authorized) {
      fetchPrompts();
      fetchBlogs();
      fetchCollections();
    }
  }, [authorized]);

  // ✅ FIXED: Handled the new paginated object structure from the backend
  const fetchPrompts = async () => {
    try {
      // Pass a high limit so the admin panel can see all inventory to manage it
      const res = await axios.get(`${API_URL}/api/prompts?limit=500`);
      
      if (res.data && res.data.prompts) {
        // New Backend Structure (Paginated)
        setPrompts(res.data.prompts);
      } else if (Array.isArray(res.data)) {
        // Fallback for old Backend Structure (Raw Array)
        setPrompts(res.data);
      } else {
        setPrompts([]);
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
      showToast('❌ Error loading prompts', 'error');
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blogs`);
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      showToast('❌ Error loading blogs', 'error');
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/collections`);
      setCollections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching collections:', err);
      showToast('❌ Error loading collections', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setAuthorized(false);
    setCheckingAuth(true);
    showToast('👋 Logged out successfully!', 'success');
    setTimeout(() => { window.location.href = "/"; }, 1000);
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!file) { showToast('❌ Please select a file', 'error'); return; }
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('promptText', formData.promptText);
    data.append('negativePrompt', formData.negativePrompt);
    data.append('aiModel', formData.aiModel);
    data.append('industry', formData.industry);
    data.append('topic', formData.topic);
    data.append('mediaType', formData.mediaType);
    data.append('isTrending', formData.isTrending.toString());
    data.append('isPromptOfDay', formData.isPromptOfDay.toString());
    data.append('media', file);
    try {
      const response = await axios.post(`${API_URL}/api/prompts`, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-admin-key': ADMIN_KEY }
      });
      showToast('✅ Prompt added successfully!', 'success');
      setFormData({
        title: '', description: '', promptText: '', negativePrompt: '',
        aiModel: 'Midjourney', industry: 'Marketing', topic: 'Logo',
        mediaType: 'image', isTrending: false, isPromptOfDay: false
      });
      setFile(null);
      fetchPrompts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      showToast(`❌ Error: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogFile) { showToast('❌ Please select a cover image', 'error'); return; }
    setLoading(true);
    const data = new FormData();
    data.append('title', blogData.title);
    data.append('slug', blogData.slug || blogData.title.toLowerCase().replace(/\s+/g, '-'));
    data.append('excerpt', blogData.excerpt);
    data.append('content', blogData.content);
    data.append('author', blogData.author);
    data.append('category', blogData.category);
    data.append('tags', blogData.tags);
    data.append('isPublished', blogData.isPublished.toString());
    data.append('coverImage', blogFile);
    data.append('metaTitle', blogData.metaTitle || blogData.title);
    data.append('metaDescription', blogData.metaDescription || blogData.excerpt);
    data.append('focusKeyword', blogData.focusKeyword);
    data.append('seoKeywords', blogData.seoKeywords);
    data.append('canonicalUrl', blogData.canonicalUrl);
    try {
      const response = await axios.post(`${API_URL}/api/blogs`, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-admin-key': ADMIN_KEY }
      });
      showToast('✅ Blog post created successfully!', 'success');
      setBlogData({
        title: '', slug: '', excerpt: '', content: '',
        author: 'Admin', category: 'Tutorial', tags: '', isPublished: false,
        metaTitle: '', metaDescription: '', focusKeyword: '', seoKeywords: '', canonicalUrl: ''
      });
      setBlogFile(null);
      fetchBlogs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      showToast(`❌ Error: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    if (!collectionFile) { showToast('❌ Please select a cover image', 'error'); return; }
    if (collectionData.prompts.length === 0) { showToast('⚠️ Please select at least 1 prompt', 'error'); return; }
    if (collectionData.description.length < 10) { showToast('⚠️ Description must be 10+ characters', 'error'); return; }
    if (collectionData.title.length < 3) { showToast('⚠️ Title must be 3+ characters', 'error'); return; }
    setLoading(true);
    const data = new FormData();
    data.append('title', collectionData.title);
    data.append('slug', collectionData.slug || collectionData.title.toLowerCase().replace(/\s+/g, '-'));
    data.append('description', collectionData.description);
    data.append('category', collectionData.category);
    data.append('prompts', JSON.stringify(collectionData.prompts));
    data.append('isPublished', collectionData.isPublished.toString());
    data.append('coverImage', collectionFile);
    try {
      const response = await axios.post(`${API_URL}/api/collections`, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-admin-key': ADMIN_KEY }
      });
      showToast('✅ Collection created successfully!', 'success');
      setCollectionData({ title: '', slug: '', description: '', category: 'Logo Design', prompts: [], isPublished: false });
      setCollectionFile(null);
      fetchCollections();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error';
      showToast(`❌ Error: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (id) => {
    if (!window.confirm("Delete this prompt? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/prompts/${id}`, { headers: { 'x-admin-key': ADMIN_KEY } });
      fetchPrompts();
      showToast('✅ Prompt deleted!', 'success');
    } catch (err) {
      showToast('❌ Error deleting prompt', 'error');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`, { headers: { 'x-admin-key': ADMIN_KEY } });
      fetchBlogs();
      showToast('✅ Blog deleted!', 'success');
    } catch (err) {
      showToast('❌ Error deleting blog', 'error');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Delete this collection? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/collections/${id}`, { headers: { 'x-admin-key': ADMIN_KEY } });
      fetchCollections();
      showToast('✅ Collection deleted!', 'success');
    } catch (err) {
      showToast('❌ Error deleting collection', 'error');
    }
  };

  const addPromptToCollection = (promptId) => {
    if (!collectionData.prompts.includes(promptId)) {
      setCollectionData(prev => ({ ...prev, prompts: [...prev.prompts, promptId] }));
    }
  };

  const removePromptFromCollection = (promptId) => {
    setCollectionData(prev => ({ ...prev, prompts: prev.prompts.filter(id => id !== promptId) }));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }} role="status" aria-label="Loading">
        <div className="text-center animate-pulse-slow">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--primary-500)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }} role="status">
        <div className="text-center card p-8">
          <AlertCircle size={32} className="mx-auto mb-4" style={{ color: 'var(--accent-red)' }} />
          <p className="mb-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Access Denied</p>
          <p style={{ color: 'var(--text-secondary)' }}>Redirecting to secure area...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg transition-all animate-slide-up ${
            toast.type === 'success' ? 'shadow-glow-primary' : ''
          }`}
          style={{ 
            backgroundColor: toast.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
            color: '#fff',
            border: `1px solid rgba(255,255,255,0.2)`
          }}
          role="alert"
          aria-live="polite"
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75 transition-opacity" aria-label="Close notification"><X size={16} /></button>
        </div>
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'rgba(10, 10, 15, 0.85)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold gradient-text tracking-tight">Admin Operations</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage prompts, blogs, and collections.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm hover-lift"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              aria-label="Logout from admin panel"
            >
              <LogOut size={16} />
              Secure Logout
            </button>
          </header>

          {/* Tab Navigation */}
          <nav className="flex flex-wrap gap-2 mt-6" role="tablist" aria-label="Admin panel sections">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-1 sm:flex-none justify-center ${
                activeTab === 'prompts' ? 'gradient-primary text-white shadow-glow-primary' : 'hover:bg-opacity-80'
              }`}
              style={{ 
                backgroundColor: activeTab === 'prompts' ? '' : 'var(--bg-card)', 
                color: activeTab === 'prompts' ? '#fff' : 'var(--text-secondary)',
                border: activeTab === 'prompts' ? 'none' : '1px solid var(--border-light)'
              }}
              role="tab"
              aria-selected={activeTab === 'prompts'}
            >
              <Image size={16} />
              Prompts
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{prompts.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-1 sm:flex-none justify-center ${
                activeTab === 'blogs' ? 'text-white' : 'hover:bg-opacity-80'
              }`}
              style={{ 
                backgroundColor: activeTab === 'blogs' ? 'var(--accent-green)' : 'var(--bg-card)', 
                color: activeTab === 'blogs' ? '#fff' : 'var(--text-secondary)',
                border: activeTab === 'blogs' ? 'none' : '1px solid var(--border-light)',
                boxShadow: activeTab === 'blogs' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              role="tab"
              aria-selected={activeTab === 'blogs'}
            >
              <BookOpen size={16} />
              Blog
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{blogs.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-1 sm:flex-none justify-center ${
                activeTab === 'collections' ? 'text-white' : 'hover:bg-opacity-80'
              }`}
              style={{ 
                backgroundColor: activeTab === 'collections' ? 'var(--accent-purple)' : 'var(--bg-card)', 
                color: activeTab === 'collections' ? '#fff' : 'var(--text-secondary)',
                border: activeTab === 'collections' ? 'none' : '1px solid var(--border-light)',
                boxShadow: activeTab === 'collections' ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none'
              }}
              role="tab"
              aria-selected={activeTab === 'collections'}
            >
              <Folder size={16} />
              Collections
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{collections.length}</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ============================================
            PROMPTS TAB
            ============================================ */}
        {activeTab === 'prompts' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" role="tabpanel">
            
            {/* Left Col: Add Form */}
            <section className="xl:col-span-5">
              <div className="card p-6 border-glow h-fit">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <PlusCircle size={20} style={{ color: 'var(--primary-400)' }} />
                  Create New Prompt
                </h2>
                
                <form onSubmit={handlePromptSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Cyberpunk Cityscape"
                      className="w-full p-3.5 rounded-xl transition-all outline-none"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-400)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Media Type *</label>
                      <select
                        className="w-full p-3.5 rounded-xl transition-all outline-none appearance-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        value={formData.mediaType}
                        onChange={e => setFormData({...formData, mediaType: e.target.value})}
                      >
                        {CATEGORY_STRUCTURE['Media Type'].map(type => (
                          <option key={type} value={type.toLowerCase()}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>AI Model *</label>
                      <select
                        className="w-full p-3.5 rounded-xl transition-all outline-none appearance-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        value={formData.aiModel}
                        onChange={e => setFormData({...formData, aiModel: e.target.value})}
                        required
                      >
                        {CATEGORY_STRUCTURE['AI Model'].map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Industry *</label>
                      <select
                        className="w-full p-3.5 rounded-xl transition-all outline-none appearance-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        value={formData.industry}
                        onChange={e => setFormData({...formData, industry: e.target.value})}
                        required
                      >
                        {CATEGORY_STRUCTURE['Industry'].map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Style / Topic *</label>
                      <select
                        className="w-full p-3.5 rounded-xl transition-all outline-none appearance-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        value={formData.topic}
                        onChange={e => setFormData({...formData, topic: e.target.value})}
                        required
                      >
                        {CATEGORY_STRUCTURE['Style'].map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Short Notes / Description *</label>
                    <input
                      type="text"
                      placeholder="Context or tips for using this prompt"
                      className="w-full p-3.5 rounded-xl transition-all outline-none"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-400)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>The AI Prompt *</label>
                    <textarea
                      placeholder="/imagine prompt: a futuristic city..."
                      className="w-full p-3.5 rounded-xl transition-all outline-none h-32 resize-y font-mono text-sm"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-400)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={formData.promptText}
                      onChange={e => setFormData({...formData, promptText: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Negative Prompt (Optional)</label>
                    <textarea
                      placeholder="blurry, distorted, low quality..."
                      className="w-full p-3.5 rounded-xl transition-all outline-none h-20 resize-y font-mono text-sm"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-400)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={formData.negativePrompt}
                      onChange={e => setFormData({...formData, negativePrompt: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl cursor-pointer transition-colors border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: formData.isTrending ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-light)', color: formData.isTrending ? 'var(--accent-yellow)' : 'var(--text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={formData.isTrending}
                        onChange={e => setFormData({...formData, isTrending: e.target.checked})}
                        className="hidden"
                      />
                      <span>🔥 Mark Trending</span>
                    </label>
                    
                    <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl cursor-pointer transition-colors border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: formData.isPromptOfDay ? 'rgba(139, 92, 246, 0.5)' : 'var(--border-light)', color: formData.isPromptOfDay ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={formData.isPromptOfDay}
                        onChange={e => setFormData({...formData, isPromptOfDay: e.target.checked})}
                        className="hidden"
                      />
                      <span>⭐ Prompt of Day</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Upload Media *</label>
                    <div className="w-full p-2.5 rounded-xl transition-all border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                      <input
                        type="file"
                        accept={formData.mediaType === 'video' ? "video/*" : "image/*"}
                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer cursor-pointer transition-colors"
                        onChange={e => setFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl transition-all font-bold text-base hover-lift flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: loading ? 'var(--bg-hover)' : 'var(--primary-600)',
                      color: loading ? 'var(--text-muted)' : '#fff',
                      boxShadow: loading ? 'none' : '0 0 20px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    {loading ? (
                      <><Loader className="animate-spin" size={20} /> Uploading & Processing...</>
                    ) : (
                      '✨ Publish Prompt to Database'
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Right Col: Manage List */}
            <section className="xl:col-span-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Inventory</h2>
                <span className="badge badge-primary">{prompts.length} Total</span>
              </div>
              
              <div className="space-y-3">
                {prompts.length === 0 ? (
                  <div className="card p-12 text-center border-dashed">
                    <Image size={48} className="mx-auto mb-4" style={{ color: 'var(--border-medium)' }} />
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Database is empty.</p>
                  </div>
                ) : (
                  // ✅ FIXED: ADDED Array.isArray CHECK HERE
                  Array.isArray(prompts) && prompts.map(prompt => (
                    <article key={prompt._id} className="card p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                        <div className="shrink-0 relative rounded-lg overflow-hidden" style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-secondary)' }}>
                          {prompt.mediaType === 'image' ? (
                            <img src={prompt.mediaUrl} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                          ) : (
                            <video src={prompt.mediaUrl} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold truncate mb-1" style={{ color: 'var(--text-primary)' }}>{prompt.title}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-400)' }}>{prompt.aiModel}</span>
                            <span className="badge" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>{prompt.topic}</span>
                            {prompt.isTrending && <span className="badge badge-yellow text-[10px] px-2 py-0.5">🔥</span>}
                            {prompt.isPromptOfDay && <span className="badge badge-purple text-[10px] px-2 py-0.5">⭐</span>}
                            <span className="badge text-[10px]" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>{prompt.copyCount || 0} copies</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeletePrompt(prompt._id)}
                        className="p-3 rounded-lg transition-all shrink-0 w-full sm:w-auto flex justify-center hover-lift"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}
                        aria-label={`Delete ${prompt.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {/* ============================================
            BLOGS TAB
            ============================================ */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" role="tabpanel">
            <section className="xl:col-span-6">
              <div className="card p-6 border-glow" style={{ '--primary-500': 'var(--accent-green)' }}>
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <BookOpen size={20} style={{ color: 'var(--accent-green)' }} />
                  Write New Blog Post
                </h2>
                <form onSubmit={handleBlogSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                      <input
                        type="text"
                        placeholder="Article Headline"
                        className="w-full p-3.5 rounded-xl transition-all outline-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        value={blogData.title}
                        onChange={e => setBlogData({...blogData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>URL Slug</label>
                      <input
                        type="text"
                        placeholder="auto-generated-if-empty"
                        className="w-full p-3.5 rounded-xl transition-all outline-none font-mono text-sm"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        value={blogData.slug}
                        onChange={e => setBlogData({...blogData, slug: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Category *</label>
                      <select
                        className="w-full p-3.5 rounded-xl transition-all outline-none appearance-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        value={blogData.category}
                        onChange={e => setBlogData({...blogData, category: e.target.value})}
                      >
                        {['Tutorial', 'Tips & Tricks', 'AI News', 'Comparison', 'Review'].map(cat => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Author</label>
                      <input
                        type="text"
                        placeholder="Author Name"
                        className="w-full p-3.5 rounded-xl transition-all outline-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        value={blogData.author}
                        onChange={e => setBlogData({...blogData, author: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Short Excerpt *</label>
                    <textarea
                      placeholder="A brief summary for the blog index page..."
                      className="w-full p-3.5 rounded-xl transition-all outline-none h-20 resize-y"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={blogData.excerpt}
                      onChange={e => setBlogData({...blogData, excerpt: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Main Content (Markdown/HTML) *</label>
                    <textarea
                      placeholder="Write your article here..."
                      className="w-full p-3.5 rounded-xl transition-all outline-none h-64 resize-y font-mono text-sm leading-relaxed"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={blogData.content}
                      onChange={e => setBlogData({...blogData, content: e.target.value})}
                      required
                    />
                  </div>

                  {/* SEO Block */}
                  <div className="p-5 rounded-xl border border-dashed space-y-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--accent-green)' }}>
                      🎯 Technical SEO
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Meta Title <span style={{ color: blogData.metaTitle.length > 60 ? 'var(--accent-red)' : 'inherit'}}>{blogData.metaTitle.length}/60</span></label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-lg outline-none text-sm"
                          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                          value={blogData.metaTitle}
                          onChange={e => setBlogData({...blogData, metaTitle: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Meta Description <span style={{ color: blogData.metaDescription.length > 160 ? 'var(--accent-red)' : 'inherit'}}>{blogData.metaDescription.length}/160</span></label>
                        <textarea
                          className="w-full p-3 rounded-lg outline-none text-sm h-16 resize-none"
                          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                          value={blogData.metaDescription}
                          onChange={e => setBlogData({...blogData, metaDescription: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Focus Keyword</label>
                          <input type="text" className="w-full p-2.5 rounded-lg outline-none text-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }} value={blogData.focusKeyword} onChange={e => setBlogData({...blogData, focusKeyword: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Canonical URL</label>
                          <input type="url" className="w-full p-2.5 rounded-lg outline-none text-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }} value={blogData.canonicalUrl} onChange={e => setBlogData({...blogData, canonicalUrl: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl cursor-pointer transition-colors border ${blogData.isPublished ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'border-transparent text-text-secondary hover:bg-white/5'}`} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: blogData.isPublished ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-light)' }}>
                      <input
                        type="checkbox"
                        checked={blogData.isPublished}
                        onChange={e => setBlogData({...blogData, isPublished: e.target.checked})}
                        className="hidden"
                      />
                      <span>📢 Publish Immediately</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Cover Image *</label>
                    <div className="w-full p-2.5 rounded-xl transition-all border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold hover:file:opacity-90 file:cursor-pointer cursor-pointer transition-colors"
                        style={{ '--tw-file-bg': 'var(--accent-green)', '--tw-file-text': '#fff' }}
                        onChange={e => setBlogFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl transition-all font-bold text-base hover-lift flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: loading ? 'var(--bg-hover)' : 'var(--accent-green)',
                      color: loading ? 'var(--text-muted)' : '#fff',
                      boxShadow: loading ? 'none' : '0 0 20px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {loading ? <><Loader className="animate-spin" size={20} /> Processing...</> : '📝 Save Blog Post'}
                  </button>
                </form>
              </div>
            </section>

            <section className="xl:col-span-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Published Articles</h2>
                <span className="badge badge-green" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>{blogs.length} Total</span>
              </div>
              
              <div className="space-y-3">
                {blogs.length === 0 ? (
                  <div className="card p-12 text-center border-dashed">
                    <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--border-medium)' }} />
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No articles published yet.</p>
                  </div>
                ) : (
                  // ✅ FIXED: ADDED Array.isArray CHECK HERE
                  Array.isArray(blogs) && blogs.map(blog => (
                    <article key={blog._id} className="card p-3 flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={blog.coverImage} alt={blog.title} className="w-16 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
                        <div className="min-w-0">
                          <h3 className="font-bold truncate mb-1" style={{ color: 'var(--text-primary)' }}>{blog.title}</h3>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span style={{ color: 'var(--text-secondary)' }}>{blog.category}</span>
                            <span style={{ color: 'var(--border-medium)' }}>•</span>
                            <span style={{ color: blog.isPublished ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="p-3 rounded-lg transition-all shrink-0 hover-lift"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {/* ============================================
            COLLECTIONS TAB
            ============================================ */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" role="tabpanel">
            <section className="xl:col-span-6">
              <div className="card p-6 border-glow" style={{ '--primary-500': 'var(--accent-purple)' }}>
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Folder size={20} style={{ color: 'var(--accent-purple)' }} />
                  Curate New Collection
                </h2>
                
                <form onSubmit={handleCollectionSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., Best Logo Prompts"
                        className="w-full p-3.5 rounded-xl transition-all outline-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        value={collectionData.title}
                        onChange={e => setCollectionData({...collectionData, title: e.target.value})}
                        required
                        minLength={3}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Category *</label>
                      <select
                        className="w-full p-3.5 rounded-xl transition-all outline-none appearance-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                        value={collectionData.category}
                        onChange={e => setCollectionData({...collectionData, category: e.target.value})}
                      >
                        {COLLECTION_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Description *</label>
                    <textarea
                      placeholder="What is this collection about? (Min 10 chars)"
                      className="w-full p-3.5 rounded-xl transition-all outline-none h-24 resize-y"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                      value={collectionData.description}
                      onChange={e => setCollectionData({...collectionData, description: e.target.value})}
                      required
                      minLength={10}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Select Included Prompts *</label>
                      <span className="badge badge-purple text-[10px] px-2 py-0.5">{collectionData.prompts.length} Selected</span>
                    </div>
                    
                    <div className="w-full p-3.5 rounded-xl transition-all h-60 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 hide-scrollbar" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                      {prompts.length === 0 ? (
                        <p className="text-sm col-span-full py-4 text-center" style={{ color: 'var(--text-muted)' }}>You need to create prompts first.</p>
                      ) : (
                        // ✅ FIXED: ADDED Array.isArray CHECK HERE
                        Array.isArray(prompts) && prompts.map(prompt => {
                          const isSelected = collectionData.prompts.includes(prompt._id);
                          return (
                            <button
                              key={prompt._id}
                              type="button"
                              onClick={() => isSelected ? removePromptFromCollection(prompt._id) : addPromptToCollection(prompt._id)}
                              className="text-left p-3 rounded-lg text-sm transition-all truncate border"
                              style={{ 
                                backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                                borderColor: isSelected ? 'var(--accent-purple)' : 'transparent',
                                color: isSelected ? '#fff' : 'var(--text-secondary)'
                              }}
                            >
                              {prompt.title}
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl cursor-pointer transition-colors border ${collectionData.isPublished ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'border-transparent text-text-secondary hover:bg-white/5'}`} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: collectionData.isPublished ? 'rgba(168, 85, 247, 0.5)' : 'var(--border-light)' }}>
                      <input
                        type="checkbox"
                        checked={collectionData.isPublished}
                        onChange={e => setCollectionData({...collectionData, isPublished: e.target.checked})}
                        className="hidden"
                      />
                      <span>📢 Publish Collection Live</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Cover Image *</label>
                    <div className="w-full p-2.5 rounded-xl transition-all border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold hover:file:opacity-90 file:cursor-pointer cursor-pointer transition-colors"
                        style={{ '--tw-file-bg': 'var(--accent-purple)', '--tw-file-text': '#fff' }}
                        onChange={e => setCollectionFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || collectionData.prompts.length === 0}
                    className="w-full py-4 rounded-xl transition-all font-bold text-base hover-lift flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: loading || prompts.length === 0 ? 'var(--bg-hover)' : 'var(--accent-purple)',
                      color: loading || prompts.length === 0 ? 'var(--text-muted)' : '#fff',
                      boxShadow: loading || prompts.length === 0 ? 'none' : '0 0 20px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    {loading ? <><Loader className="animate-spin" size={20} /> Packaging...</> : '📦 Build Collection'}
                  </button>
                </form>
              </div>
            </section>

            <section className="xl:col-span-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Live Collections</h2>
                <span className="badge badge-purple">{collections.length} Total</span>
              </div>
              
              <div className="space-y-3">
                {collections.length === 0 ? (
                  <div className="card p-12 text-center border-dashed">
                    <Folder size={48} className="mx-auto mb-4" style={{ color: 'var(--border-medium)' }} />
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No collections built yet.</p>
                  </div>
                ) : (
                  // ✅ FIXED: ADDED Array.isArray CHECK HERE
                  Array.isArray(collections) && collections.map(collection => (
                    <article key={collection._id} className="card p-3 flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={collection.coverImage} alt={collection.title} className="w-16 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
                        <div className="min-w-0">
                          <h3 className="font-bold truncate mb-1" style={{ color: 'var(--text-primary)' }}>{collection.title}</h3>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span style={{ color: 'var(--text-secondary)' }}>{collection.category}</span>
                            <span style={{ color: 'var(--border-medium)' }}>•</span>
                            <span style={{ color: 'var(--primary-400)' }}>{collection.prompts?.length || 0} items</span>
                            <span style={{ color: 'var(--border-medium)' }}>•</span>
                            <span style={{ color: collection.isPublished ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                              {collection.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteCollection(collection._id)}
                        className="p-3 rounded-lg transition-all shrink-0 hover-lift"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;