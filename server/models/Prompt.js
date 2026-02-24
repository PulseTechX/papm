const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true }, 
  description: { type: String, required: true },
  promptText: { type: String, required: true },
  negativePrompt: { type: String, default: '' },
  
  // ⚡ Added inline indexing for fast dropdown filtering
  aiModel: { type: String, required: true, index: true },
  industry: { type: String, required: true, index: true },
  topic: { type: String, required: true, index: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true, index: true },
  
  // ✅ Added missing tags array so your global search works!
  tags: { type: [String], index: true, default: [] }, 
  
  isTrending: { type: Boolean, default: false, index: true },
  isPromptOfDay: { type: Boolean, default: false },
  copyCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  mediaUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ============================================
// 🚀 INDEXES FOR LIGHTNING FAST QUERIES (100k+ Records)
// ============================================

// 1. Sort Indexes (Crucial for Pagination Speed)
promptSchema.index({ createdAt: -1 }); 

// 2. Filter Indexes (Speeds up the dropdown menus instantly)
promptSchema.index({ mediaType: 1, createdAt: -1 });
promptSchema.index({ aiModel: 1, createdAt: -1 });
promptSchema.index({ industry: 1, createdAt: -1 });
promptSchema.index({ topic: 1, createdAt: -1 });
promptSchema.index({ isTrending: 1, createdAt: -1 });

// 3. 🧠 Expanded Full-Text Search Index 
// This powers the massive global search we added to server.js
promptSchema.index({ 
  title: 'text', 
  tags: 'text',
  aiModel: 'text',
  industry: 'text',
  topic: 'text',
  description: 'text', 
  promptText: 'text' 
}, {
  // Weights dictate importance. If a user searches "Cyberpunk", 
  // a prompt with "Cyberpunk" in the Title will show up before 
  // a prompt with "Cyberpunk" buried deep in the prompt text.
  weights: { 
    title: 10, 
    tags: 8, 
    aiModel: 5, 
    topic: 5, 
    industry: 3, 
    description: 2, 
    promptText: 1 
  } 
});

module.exports = mongoose.model('Prompt', promptSchema);