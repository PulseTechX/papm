const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Collection title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: { 
    type: String, 
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  coverImage: { 
    type: String, 
    required: [true, 'Cover image is required'],
    trim: true
  },
  prompts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prompt'
  }],
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  views: { 
    type: Number, 
    default: 0,
    min: 0
  },
  downloads: { 
    type: Number, 
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// ============================================
// 📝 INDEXES FOR BETTER PERFORMANCE
// ============================================
collectionSchema.index({ category: 1, isPublished: 1 });
collectionSchema.index({ isPublished: 1, createdAt: -1 });

// Full-Text Search Index for Collections
collectionSchema.index({ 
  title: 'text', 
  description: 'text' 
});

// ============================================
// 🔧 PRE-SAVE MIDDLEWARE
// ============================================
collectionSchema.pre('save', async function() {
  this.updatedAt = Date.now();
  
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    if (this.isNew) {
      const existingCollection = await this.constructor.findOne({ slug: this.slug });
      if (existingCollection) {
        this.slug = `${this.slug}-${Date.now()}`;
      }
    }
  }
});

// ============================================
// 🛠️ INSTANCE & STATIC METHODS
// ============================================
collectionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

collectionSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

collectionSchema.statics.findPublished = function() {
  return this.find({ isPublished: true }).sort({ createdAt: -1 });
};

collectionSchema.statics.findByCategory = function(category) {
  return this.find({ category, isPublished: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Collection', collectionSchema);