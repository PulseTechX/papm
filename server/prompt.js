const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  // ============================================
  // 📝 BASIC CONTENT
  // ============================================
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  // ✅ NEW: SEO-Friendly Slug
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  promptText: { 
    type: String, 
    required: true,
    trim: true
  },
  negativePrompt: { 
    type: String, 
    default: '',
    trim: true
  },
  
  // ============================================
  // 🏷️ CATEGORIZATION
  // ============================================
  aiModel: { 
    type: String, 
    required: true,
    trim: true
  },
  industry: { 
    type: String, 
    required: true,
    trim: true
  },
  topic: { 
    type: String, 
    required: true,
    trim: true
  },
  mediaType: { 
    type: String, 
    enum: ['image', 'video'], 
    required: true 
  },
  
  // ============================================
  // ⭐ FEATURES & STATS
  // ============================================
  isTrending: { 
    type: Boolean, 
    default: false 
  },
  isPromptOfDay: { 
    type: Boolean, 
    default: false 
  },
  copyCount: { 
    type: Number, 
    default: 0 
  },
  views: {
    type: Number,
    default: 0
  },
  
  // ============================================
  // 🖼️ MEDIA
  // ============================================
  mediaUrl: { 
    type: String, 
    required: true 
  },
  
  // ============================================
  // 📅 DATE FIELDS
  // ============================================
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // Enable timestamps (createdAt, updatedAt)
  timestamps: true
});

// ============================================
// 🔍 INDEXES FOR SEO & PERFORMANCE
// ============================================

// Index on slug for fast URL lookups
promptSchema.index({ slug: 1 });

// Index on trending + prompt of the day for featured sections
promptSchema.index({ isTrending: 1, isPromptOfDay: 1 });

// Index on AI model for filtering
promptSchema.index({ aiModel: 1 });

// Index on industry for filtering
promptSchema.index({ industry: 1 });

// Index on topic for filtering
promptSchema.index({ topic: 1 });

// Index on copy count for popular prompts
promptSchema.index({ copyCount: -1 });

// Index on creation date for sorting
promptSchema.index({ createdAt: -1 });

// Text index for search functionality
promptSchema.index({ 
  title: 'text', 
  description: 'text', 
  promptText: 'text',
  topic: 'text',
  aiModel: 'text'
});

// ============================================
// ⚙️ MIDDLEWARE
// ============================================

// Auto-generate slug from title before saving
promptSchema.pre('save', function(next) {
  // Generate slug from title if not provided or if title changed
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    // Add random string if slug already exists (for uniqueness)
    // This handles duplicate titles
    if (this.isModified('slug')) {
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      this.slug = `${this.slug}-${randomSuffix}`;
    }
  }
  
  // Update timestamp
  this.updatedAt = new Date();
  
  next();
});

// ============================================
// 🛠️ HELPER METHODS
// ============================================

// Get full URL for this prompt
promptSchema.methods.getFullUrl = function(baseUrl) {
  return `${baseUrl}/prompt/${this.slug}`;
};

// Get SEO-optimized title
promptSchema.methods.getSEOTitle = function() {
  return `${this.title} - ${this.aiModel} AI Prompt | AI Prompt Library`;
};

// Get SEO-optimized description
promptSchema.methods.getSEODescription = function() {
  return this.description || `${this.promptText.substring(0, 150)}...`;
};

// Get structured data for Schema.org
promptSchema.methods.getStructuredData = function(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "headline": this.title,
    "description": this.getSEODescription(),
    "image": this.mediaUrl,
    "author": {
      "@type": "Organization",
      "name": "AI Prompt Library",
      "url": baseUrl
    },
    "datePublished": this.createdAt,
    "dateModified": this.updatedAt,
    "keywords": [this.aiModel, this.topic, this.industry].filter(Boolean),
    "articleBody": this.promptText,
    "publisher": {
      "@type": "Organization",
      "name": "AI Prompt Library",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo192.png`
      }
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "http://schema.org/DownloadAction",
      "userInteractionCount": this.copyCount || 0
    }
  };
};

// ============================================
// 📊 STATIC METHODS
// ============================================

// Get prompt of the day
promptSchema.statics.getPromptOfDay = async function() {
  // First try to find prompt marked as prompt of the day
  let prompt = await this.findOne({ isPromptOfDay: true });
  
  // If none, get a random trending prompt
  if (!prompt) {
    prompt = await this.findOne({ isTrending: true }).sort({ createdAt: -1 });
  }
  
  // If still none, get the latest prompt
  if (!prompt) {
    prompt = await this.findOne().sort({ createdAt: -1 });
  }
  
  return prompt;
};

// Get related prompts
promptSchema.statics.getRelatedPrompts = async function(promptId, topic, aiModel, limit = 4) {
  return await this.find({
    _id: { $ne: promptId },
    $or: [
      { topic: topic },
      { aiModel: aiModel }
    ]
  })
  .limit(limit)
  .sort({ copyCount: -1 });
};

module.exports = mongoose.model('Prompt', promptSchema);