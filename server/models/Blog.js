const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  category: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  isPublished: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  
  // SEO FIELDS
  metaTitle: { type: String, trim: true, maxlength: 60, default: function() { return this.title; } },
  metaDescription: { type: String, trim: true, maxlength: 160, default: function() { return this.excerpt; } },
  focusKeyword: { type: String, trim: true, lowercase: true },
  canonicalUrl: { type: String, trim: true, default: null },
  ogImage: { type: String, default: function() { return this.coverImage; } },
  readingTime: { type: Number, default: 0 },
  seoKeywords: [{ type: String, trim: true, lowercase: true }],
  internalLinks: [{ title: String, url: String }],
  externalLinks: [{ title: String, url: String }],
  schemaType: { type: String, enum: ['BlogPosting', 'Article', 'NewsArticle', 'TechArticle'], default: 'BlogPosting' },
  
  publishedAt: { type: Date, default: null },
}, { timestamps: true });

// ============================================
// 🔍 INDEXES FOR SEO & PERFORMANCE
// ============================================
// Note: slug is already indexed via unique:true
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ category: 1, isPublished: 1 });
blogSchema.index({ tags: 1, isPublished: 1 });

// Text index for fast blog searching
blogSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  tags: 'text'
}, {
  weights: { title: 10, tags: 5, excerpt: 3, content: 1 }
});

// ============================================
// ⚙️ MIDDLEWARE
// ============================================
blogSchema.pre('save', async function() {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
  }
  this.updatedAt = new Date();
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.isModified('content')) {
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
});

// ============================================
// 🛠️ HELPER METHODS
// ============================================
blogSchema.methods.getFullUrl = function(baseUrl) { return `${baseUrl}/blog/${this.slug}`; };
blogSchema.methods.getSEOTitle = function() { return this.metaTitle || `${this.title} | AI Prompt Library`; };
blogSchema.methods.getSEODescription = function() { return this.metaDescription || this.excerpt; };

blogSchema.methods.getStructuredData = function(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": this.schemaType,
    "headline": this.title,
    "description": this.getSEODescription(),
    "image": this.ogImage || this.coverImage,
    "author": { "@type": "Person", "name": this.author },
    "datePublished": this.publishedAt || this.createdAt,
    "dateModified": this.updatedAt,
    "publisher": {
      "@type": "Organization",
      "name": "AI Prompt Library",
      "logo": { "@type": "ImageObject", "url": `${baseUrl}/logo192.png` }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": this.getFullUrl(baseUrl) },
    "wordCount": this.content.trim().split(/\s+/).length,
    "articleBody": this.content
  };
};

module.exports = mongoose.model('Blog', blogSchema);