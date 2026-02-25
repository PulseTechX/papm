require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const multer = require('multer');
const axios = require('axios'); // Required for DeepSeek API calls
const Prompt = require('./models/Prompt');
const Blog = require('./models/Blog');
const Collection = require('./models/Collection');

// ✅ DigitalOcean Spaces upload utility
const uploadToSpaces = require('./utils/uploadToSpaces');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ============================================
// 🔒 SECURITY MIDDLEWARE
// ============================================

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000'
    ].filter(Boolean);
    
    // ✅ Allow all DigitalOcean app URLs dynamically
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('ondigitalocean.app')) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

const isDevelopment = process.env.NODE_ENV !== 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 500 : 100,
  message: '❌ Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 100 : 20,
  message: '❌ Too many admin requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/prompts', adminLimiter);
app.use('/api/blogs', adminLimiter);
app.use('/api/collections', adminLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }
  next();
});

// ============================================
// 📦 FILE UPLOAD CONFIGURATION (MEMORY STORAGE)
// ============================================

// ✅ CRITICAL FIX: Files are now kept in RAM (memoryStorage) 
// so they can be sent directly to DigitalOcean Spaces!
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('❌ Only image and video files are allowed'));
  }
});

// ============================================
// 🗄️ DATABASE CONNECTION
// ============================================
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ============================================
// 🛡️ SECURITY HELPER FUNCTIONS
// ============================================

const verifyAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  
  const isValid = adminKey && 
    adminKey.length === process.env.ADMIN_SECRET?.length && 
    adminKey === process.env.ADMIN_SECRET;
  
  if (!isValid) {
    console.warn(`⚠️ Unauthorized access attempt from IP: ${req.ip}`);
    return res.status(403).json({ message: '❌ Unauthorized' });
  }
  
  next();
};

const validateInput = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

// ============================================
// 📡 API ROUTES
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// 🧠 AI PROMPT GENERATOR (DeepSeek Integration)
// ============================================

app.post('/api/generate-prompt', limiter, async (req, res) => {
  try {
    const {
      mediaType, targetEngine, aspectRatio, subject, action, setting,
      medium, lighting, cameraAngle, lens, renderEngine, mood, cameraMotion,
      colorGrading, weather, timeOfDay, composition, vfx, filmStock, texture, era
    } = req.body;

    if (!subject) {
      return res.status(400).json({ message: 'Main subject is required.' });
    }

    // --- ANTI-BLEED SMART FILTERING ---
    const sceneSpecs = { action, setting, era };
    let sceneElementsList = `Subject: ${subject}\n`;
    for (const [key, value] of Object.entries(sceneSpecs)) {
      if (value && value.trim() !== '' && value !== 'None') {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        sceneElementsList += `${formattedKey}: ${value}\n`;
      }
    }

    const styleSpecs = { medium, texture, lighting, timeOfDay, weather, cameraAngle, composition, lens, filmStock, colorGrading, vfx, renderEngine, mood };
    if (mediaType === 'video') styleSpecs.cameraMotion = cameraMotion;

    let styleMetadataList = "";
    for (const [key, value] of Object.entries(styleSpecs)) {
      if (value && value.trim() !== '' && value !== 'None') {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        styleMetadataList += `${formattedKey}: ${value}\n`;
      }
    }

    // 1. Build advanced, highly descriptive engine rules
    let engineRules = "";
    if (targetEngine === 'Midjourney v6') {
      engineRules = `Write a highly complex, comma-separated string of professional tags. Order: Subject, Setting, Medium, Lighting, Camera, Render. Use advanced cinematic terminology. Append exactly '--ar ${aspectRatio} --v 6.0' to the very end. Do not use full sentences.`;
    } else if (targetEngine === 'DALL-E 3') {
      engineRules = "Write an incredibly descriptive, vivid, flowing paragraph. Seamlessly integrate the provided parameters into a natural narrative. Keep it under 100 words.";
    } else if (targetEngine === 'Stable Diffusion XL' || targetEngine === 'Flux.1 Pro') {
      engineRules = `Use advanced Danbooru-style tag weightings. Start the prompt with '(masterpiece, best quality, ultra-detailed, photorealistic:1.2)'. Separate concepts with commas. Be exhaustively detailed.`;
    } else if (mediaType === 'video') { 
      engineRules = `Focus on cinematic motion, physics, and time. Use dense, comma-separated keywords. DO NOT write long paragraphs. End with '4k, 60fps, cinematic motion blur'.`;
    }

    // 2. The Elite System Prompt
    const systemPrompt = `You are an elite AI prompt engineer. Expand the user's basic concepts into EXACTLY ONE highly detailed, professional AI prompt. 
    
    CRITICAL CONSTRAINTS TO PREVENT "TEXT BLEED" AND CRASHES:
    1. You MUST use the technical parameters the user provides, but format them so the AI knows they are STYLE METADATA, not physical objects.
    2. NEVER just list camera brands. Write "shot on [Brand] film stock", "[Brand] aesthetic", or "rendered in [Engine] style" at the very END of the prompt.
    3. Explicitly ensure camera brands and render engines are NOT described as being inside the physical scene (no banners or logos).
    4. ABSOLUTE LENGTH LIMIT: Your total response MUST BE STRICTLY UNDER 150 WORDS. Use dense keywords, do not write essays. If you exceed this limit, the system will crash.
    5. You MUST generate a Negative Prompt starting with: "text, typography, logos, watermarks, signs with text, camera brand names, UI," followed by other relevant negative terms.

    RULES:
    - Target Engine: ${targetEngine}
    - Specific Engine Rules: ${engineRules}
    - YOU MUST RETURN ONLY A VALID JSON OBJECT.
    
    EXACT FORMAT REQUIRED:
    {
      "prompt": "Your dense, highly detailed prompt here... [style metadata here]",
      "negativePrompt": "text, typography, logos, watermarks, ugly, deformed..."
    }`;

    const userPrompt = `
    Expand these concepts into a master prompt. 
    
    SCENE ELEMENTS (Describe what is physically happening):
    ${sceneElementsList}
    
    STYLE METADATA (Apply as aesthetic/camera settings at the end of the prompt):
    ${styleMetadataList || 'None specified.'}
    `;

    // 3. Make the API Call to DeepSeek
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6, 
      max_tokens: 1300, 
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 4. Parse the JSON object
    const rawOutput = response.data.choices[0].message.content.trim();
    const jsonString = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const generatedData = JSON.parse(jsonString);

    res.json(generatedData);

  } catch (error) {
    console.error('❌ DeepSeek API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to generate prompts. The AI might be overloaded.',
      error: error.message 
    });
  }
});

// ============================================
// 🪄 AI PROMPT ENHANCER (DeepSeek Integration)
// ============================================

app.post('/api/enhance-prompt', limiter, async (req, res) => {
  try {
    const { originalPrompt, mediaType, targetEngine, enhancementStyle } = req.body;

    if (!originalPrompt) {
      return res.status(400).json({ message: 'Original prompt is required.' });
    }

    // 1. Build Engine Rules
    let engineRules = "";
    if (targetEngine === 'Midjourney v6') {
      engineRules = `Format as a dense, comma-separated string. Use highly advanced photographic and rendering terminology. End with '--v 6.0'.`;
    } else if (targetEngine === 'DALL-E 3') {
      engineRules = "Format as a rich, flowing, highly descriptive paragraph. Do not use random camera brands, use natural language.";
    } else if (targetEngine === 'Stable Diffusion XL' || targetEngine === 'Flux.1 Pro') {
      engineRules = `Format with Danbooru-style tag weightings. Start with '(masterpiece, best quality, ultra-detailed:1.2)'. Use comma-separated concepts.`;
    } else if (mediaType === 'video') { 
      engineRules = `Focus heavily on motion, camera tracking, fluid dynamics, and temporal changes. End the prompt with '4k, 60fps, cinematic motion blur'. DO NOT write long essays. Keep it dense.`;
    }

    // 2. Build the System Instruction (Anti-Crash Version)
    const systemPrompt = `You are an elite AI prompt engineer. The user has provided a basic, unoptimized prompt. Your objective is to ENHANCE and expand it into a professional, studio-quality prompt.

    CRITICAL CONSTRAINTS TO PREVENT CRASHES:
    1. Preserve the core subject and intent of the user's original idea.
    2. Inject professional lighting, camera angles, textures, and atmospheric details suitable for the requested style: [${enhancementStyle}].
    3. If the media type is Image, focus on composition and lighting. If Video, focus heavily on motion and camera movement.
    4. Format the output specifically for [${targetEngine}]: ${engineRules}
    5. EXTREME LENGTH LIMIT: Your enhanced prompt MUST BE STRICTLY UNDER 100 WORDS. Do not write massive paragraphs. If you exceed this length, the system will crash. Be dense, professional, and concise.
    6. ALWAYS generate a relevant Negative Prompt starting with: "text, typography, logos, watermarks..." (Keep the negative prompt under 40 words).
    
    YOU MUST RETURN ONLY A VALID JSON OBJECT.
    {
      "enhancedPrompt": "Your deeply enhanced, highly detailed prompt here...",
      "negativePrompt": "text, typography, logos..."
    }`;

    // 3. Make API Call to DeepSeek
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please enhance this idea: "${originalPrompt}"` }
      ],
      temperature: 0.5, // 🔒 ANTI-CRASH: Lowered to prevent rambling
      max_tokens: 800, // 🔒 ANTI-CRASH: Enforced safety net
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 4. Parse Output
    const rawOutput = response.data.choices[0].message.content.trim();
    const jsonString = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const generatedData = JSON.parse(jsonString);

    res.json(generatedData);

  } catch (error) {
    console.error('❌ DeepSeek Enhancer Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to enhance prompt. The AI might be overloaded.',
      error: error.message 
    });
  }
});

// ============================================
// 🛡️ AI NEGATIVE PROMPT GENERATOR (DeepSeek)
// ============================================

app.post('/api/generate-negative-prompt', limiter, async (req, res) => {
  try {
    const { mediaType, targetEngine, avoidStyle, baseContext, specificBans } = req.body;

    // 1. Build Model/Media specific negative rules
    let negativeRules = "";
    
    if (mediaType === 'video') {
      negativeRules = `Focus heavily on video artifacts: static, morphing, freezing, jitter, unnatural physics, sudden cuts, bad temporal consistency, lag, low framerate, jerky motion.`;
    } else {
      negativeRules = `Focus heavily on image artifacts: extra limbs, bad anatomy, deformed hands, fused fingers, cross-eyed, mutated, poorly drawn face, asymmetrical features, flat lighting.`;
    }

    if (targetEngine === 'Stable Diffusion XL' || targetEngine === 'Flux.1 Pro') {
      negativeRules += ` Use Danbooru-style tags and brackets for weightings (e.g. (worst quality, low quality:1.4)).`;
    } else if (targetEngine === 'Midjourney v6') {
      negativeRules += ` Format as a dense, comma-separated list of words. Do not use weights like :1.5.`;
    } else if (targetEngine === 'DALL-E 3') {
      negativeRules += ` Format as a concise, readable descriptive sentence of what NOT to include.`;
    }

    // Handle styles to avoid
    let styleBans = "";
    if (avoidStyle !== 'None') {
      if (avoidStyle === 'Cartoon & Anime') styleBans = "anime, cartoon, drawing, illustration, 2d, sketch, cell shaded, comic;";
      if (avoidStyle === 'Photorealism') styleBans = "photorealistic, photo, camera, realistic, 8k, ultra-detailed, photography;";
      if (avoidStyle === '3D Render / CGI') styleBans = "3d render, cgi, octane render, unreal engine, plastic, smooth, clay;";
      if (avoidStyle === 'Vintage / Retro') styleBans = "vintage, retro, sepia, black and white, old, faded, film grain;";
      if (avoidStyle === 'Painting / Illustration') styleBans = "painting, oil, brush strokes, watercolor, digital art, stylized;";
    }

    // 2. The System Prompt (Anti-Crash Version)
    const systemPrompt = `You are an elite AI prompt engineer specializing in NEGATIVE PROMPTS. Your only job is to generate a highly detailed, professional negative prompt string to protect the user's AI generation from artifacts and unwanted elements.

    CRITICAL CONSTRAINTS TO PREVENT CRASHES:
    1. Output ONLY the negative keywords/phrases. Do NOT write full sentences or paragraphs. Use a dense, comma-separated list.
    2. ALWAYS include standard universal bans: "text, typography, watermark, logo, signature, username, UI".
    3. Apply these media/model rules: ${negativeRules}
    4. Base Context: ${baseContext || 'General Scene'}
    5. Specific elements to BAN: ${specificBans || 'None specified.'}
    6. Styles to strictly avoid: ${styleBans || 'None specified.'}
    7. EXTREME LENGTH LIMIT: Your response MUST BE STRICTLY UNDER 60 WORDS. Do not write a massive list. If you exceed this length, the system will crash. Be concise and ruthless.
    
    YOU MUST RETURN ONLY A VALID JSON OBJECT.
    {
      "negativePrompt": "text, watermark, ugly, deformed, [add max 40 more concise words here]"
    }`;

    // 3. Make API Call to DeepSeek
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate the ultimate negative prompt for this setup.` }
      ],
      temperature: 0.5, // 🔒 ANTI-CRASH: Lowered to stop hallucinating endless words
      max_tokens: 500, // 🔒 ANTI-CRASH: Forced hard stop
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 4. Parse Output
    const rawOutput = response.data.choices[0].message.content.trim();
    const jsonString = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const generatedData = JSON.parse(jsonString);

    res.json(generatedData);

  } catch (error) {
    console.error('❌ DeepSeek Negative Prompt Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to generate negative prompt. The AI might be overloaded.',
      error: error.message 
    });
  }
});

// ============================================
// 🎯 PROMPT ROUTES
// ============================================

app.get('/api/prompts', async (req, res) => {
  try {
    const { model, industry, topic, trending, search, mediaType } = req.query;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const skip = (page - 1) * limit;

    let query = {};

    if (model && model !== 'All') query.aiModel = model;
    if (industry && industry !== 'All') query.industry = industry;
    if (topic && topic !== 'All') query.topic = topic;
    if (mediaType && mediaType !== 'All') query.mediaType = mediaType.toLowerCase();
    if (trending === 'true') query.isTrending = true;
    
    // 🔍 MASSIVE GLOBAL SEARCH: Scans across the entire database
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { promptText: { $regex: search, $options: 'i' } },
        { aiModel: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { negativePrompt: { $regex: search, $options: 'i' } },
        { mediaType: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } } 
      ];
    }

    const totalPrompts = await Prompt.countDocuments(query);
    
    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      prompts,
      currentPage: page,
      totalPages: Math.ceil(totalPrompts / limit),
      totalPrompts
    });
  } catch (error) {
    console.error('❌ Get Prompts Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/prompts/prompt-of-the-day', async (req, res) => {
  try {
    let prompt = await Prompt.findOne({ isPromptOfDay: true });
    
    if (!prompt) {
      prompt = await Prompt.findOne({ isTrending: true }).sort({ createdAt: -1 });
    }
    
    if (!prompt) {
      prompt = await Prompt.findOne().sort({ createdAt: -1 });
    }
    
    res.json(prompt || { message: 'No prompts available' });
  } catch (error) {
    console.error('❌ Get Prompt of the Day Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/prompts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let prompt = null;
    
    prompt = await Prompt.findOne({ slug: id });
    
    if (!prompt && mongoose.Types.ObjectId.isValid(id)) {
      prompt = await Prompt.findById(id);
    }
    
    if (!prompt) {
      return res.status(404).json({ message: '❌ Prompt not found' });
    }
    
    res.json(prompt);
  } catch (error) {
    console.error('❌ Get Single Prompt Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/prompts/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let prompt = await Prompt.findOne({ slug: slug });
    
    if (!prompt && mongoose.Types.ObjectId.isValid(slug)) {
      prompt = await Prompt.findById(slug);
    }

    if (!prompt) {
      return res.status(404).json({ message: '❌ Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    console.error('❌ Get Prompt by Slug Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/prompts/:id/copy', async (req, res) => {
  try {
    const result = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { copyCount: 1 } },
      { returnDocument: 'after' }
    );
    
    res.json({ message: '✅ Copy count incremented', newCount: result.copyCount });
  } catch (error) {
    console.error('❌ Increment Copy Count Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/prompts', verifyAdmin, upload.single('media'), async (req, res) => {
  try {
    const { title, promptText, aiModel, industry, topic } = req.body;
    const errors = validateInput(req.body, ['title', 'promptText', 'aiModel', 'industry', 'topic']);
    
    if (errors.length > 0) {
      return res.status(400).json({ message: '❌ Validation failed', errors });
    }

    if (!req.file) {
      return res.status(400).json({ message: '❌ No file uploaded' });
    }

    // ✅ NEW: Upload to DigitalOcean Spaces
    const uploadResult = await uploadToSpaces(req.file, 'prompts');
    const mediaUrl = uploadResult.url;

    const slug = title.trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    const sanitizedData = {
      title: title.trim(),
      slug: slug,
      description: req.body.description?.trim() || '',
      promptText: promptText.trim(),
      negativePrompt: req.body.negativePrompt?.trim() || '',
      aiModel: aiModel.trim(),
      industry: industry.trim(),
      topic: topic.trim(),
      mediaType: req.body.mediaType || 'image',
      isTrending: req.body.isTrending === 'true',
      isPromptOfDay: req.body.isPromptOfDay === 'true',
      mediaUrl: mediaUrl
    };

    if (sanitizedData.isPromptOfDay) {
      await Prompt.updateMany({}, { $set: { isPromptOfDay: false } });
    }
    
    const newPrompt = new Prompt(sanitizedData);
    await newPrompt.save();
    
    console.log(`✅ Prompt created by admin: ${sanitizedData.title}`);
    res.status(201).json({ message: '✅ Prompt created successfully!', prompt: newPrompt });
  } catch (error) {
    console.error('❌ Create Prompt Error:', error.message);
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
});

app.put('/api/prompts/:id', verifyAdmin, upload.single('media'), async (req, res) => {
  try {
    const { title, promptText, aiModel, industry, topic } = req.body;
    
    const slug = title.trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    let updateData = {
      title: title.trim(),
      slug: slug,
      description: req.body.description?.trim(),
      promptText: promptText.trim(),
      negativePrompt: req.body.negativePrompt?.trim(),
      aiModel: aiModel.trim(),
      industry: industry.trim(),
      topic: topic.trim(),
      mediaType: req.body.mediaType,
      isTrending: req.body.isTrending === 'true',
      isPromptOfDay: req.body.isPromptOfDay === 'true'
    };

    if (req.file) {
      // ✅ NEW: Upload to DigitalOcean Spaces
      const uploadResult = await uploadToSpaces(req.file, 'prompts');
      updateData.mediaUrl = uploadResult.url;
    }

    if (updateData.isPromptOfDay) {
      await Prompt.updateMany({}, { $set: { isPromptOfDay: false } });
    }

    const prompt = await Prompt.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!prompt) {
      return res.status(404).json({ message: '❌ Prompt not found' });
    }

    console.log(`✅ Prompt updated and slug generated: ${prompt.slug}`);
    res.json({ message: '✅ Prompt updated!', prompt });
  } catch (error) {
    console.error('❌ Update Prompt Error:', error.message);
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
});

app.delete('/api/prompts/:id', verifyAdmin, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: '❌ Prompt not found' });
    }
    
    await Prompt.findByIdAndDelete(req.params.id);
    console.log(`✅ Prompt deleted by admin: ${prompt.title}`);
    res.json({ message: '✅ Deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// 📝 BLOG ROUTES
// ============================================

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    await Blog.findByIdAndUpdate(
      blog._id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blogs', verifyAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const errors = validateInput(req.body, ['title', 'excerpt', 'content', 'category']);
    if (errors.length > 0) {
      return res.status(400).json({ message: '❌ Validation failed', errors });
    }

    if (!req.file) {
      return res.status(400).json({ message: '❌ Cover image required' });
    }

    // ✅ NEW: Upload to DigitalOcean Spaces
    const uploadResult = await uploadToSpaces(req.file, 'blogs');
    const coverImageUrl = uploadResult.url;

    const newBlog = new Blog({
      title: req.body.title.trim(),
      slug: req.body.slug?.trim() || req.body.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: req.body.excerpt.trim(),
      content: req.body.content.trim(),
      author: req.body.author?.trim() || 'Admin',
      category: req.body.category.trim(),
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      isPublished: req.body.isPublished === 'true',
      coverImage: coverImageUrl,
      metaTitle: req.body.metaTitle?.trim() || req.body.title.trim(),
      metaDescription: req.body.metaDescription?.trim() || req.body.excerpt.trim(),
      focusKeyword: req.body.focusKeyword?.trim() || '',
      seoKeywords: req.body.seoKeywords ? req.body.seoKeywords.split(',').map(k => k.trim()) : [],
      canonicalUrl: req.body.canonicalUrl?.trim() || null,
      ogImage: coverImageUrl,
      schemaType: 'BlogPosting'
    });
    
    await newBlog.save();
    res.status(201).json({ message: '✅ Blog created successfully!', blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const updates = {
      title: req.body.title?.trim(),
      slug: req.body.slug?.trim(),
      excerpt: req.body.excerpt?.trim(),
      content: req.body.content?.trim(),
      author: req.body.author?.trim(),
      category: req.body.category?.trim(),
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      isPublished: req.body.isPublished === 'true',
      metaTitle: req.body.metaTitle?.trim(),
      metaDescription: req.body.metaDescription?.trim(),
      focusKeyword: req.body.focusKeyword?.trim(),
      seoKeywords: req.body.seoKeywords ? req.body.seoKeywords.split(',').map(k => k.trim()) : [],
      canonicalUrl: req.body.canonicalUrl?.trim()
    };

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: '✅ Blog updated!', blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// 📦 COLLECTION ROUTES
// ============================================

app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Collection.find({ isPublished: true })
      .populate('prompts')
      .sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/collections/:slug', async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug }).populate('prompts');
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    await Collection.findByIdAndUpdate(
      collection._id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/collections', verifyAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const errors = validateInput(req.body, ['title', 'description', 'category']);
    if (errors.length > 0) {
      return res.status(400).json({ message: '❌ Validation failed', errors });
    }

    if (!req.file) {
      return res.status(400).json({ message: '❌ Cover image required' });
    }

    // ✅ NEW: Upload to DigitalOcean Spaces
    const uploadResult = await uploadToSpaces(req.file, 'collections');
    const coverImageUrl = uploadResult.url;

    let promptsArray = [];
    if (req.body.prompts) {
      try {
        promptsArray = typeof req.body.prompts === 'string' 
          ? JSON.parse(req.body.prompts) 
          : req.body.prompts;
      } catch (parseError) {
        promptsArray = [];
      }
    }

    const slug = req.body.title.trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    const newCollection = new Collection({
      title: req.body.title.trim(),
      slug: slug,
      description: req.body.description.trim(),
      coverImage: coverImageUrl,
      category: req.body.category.trim(),
      prompts: promptsArray,
      isPublished: req.body.isPublished === 'true'
    });
    
    await newCollection.save();
    res.status(201).json({ message: '✅ Collection created!', collection: newCollection });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
});

app.put('/api/collections/:id', verifyAdmin, async (req, res) => {
  try {
    const updates = {
      title: req.body.title?.trim(),
      slug: req.body.slug?.trim(),
      description: req.body.description?.trim(),
      category: req.body.category?.trim(),
      prompts: req.body.prompts,
      isPublished: req.body.isPublished === 'true'
    };

    const collection = await Collection.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: '✅ Collection updated!', collection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/collections/:id', verifyAdmin, async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// 🔍 SEO ROUTES (Sitemap)
// ============================================

app.get('/sitemap-prompts.xml', async (req, res) => {
  try {
    const prompts = await Prompt.find({}).select('slug updatedAt');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    prompts.forEach(prompt => {
      xml += '  <url>\n';
      xml += '    <loc>' + BASE_URL + '/prompt/' + prompt.slug + '</loc>\n';
      xml += '    <lastmod>' + prompt.updatedAt.toISOString() + '</lastmod>\n';
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/sitemap-blogs.xml', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).select('slug updatedAt');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    blogs.forEach(blog => {
      xml += '  <url>\n';
      xml += '    <loc>' + BASE_URL + '/blog/' + blog.slug + '</loc>\n';
      xml += '    <lastmod>' + blog.updatedAt.toISOString() + '</lastmod>\n';
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// 🚀 START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('============================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Security: Helmet + Rate Limit + MongoDB Sanitize + CORS`);
  console.log(`📊 Rate Limits: ${isDevelopment ? '500 req/15min (Dev)' : '100 req/15min (Prod)'}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads: Memory Storage (DigitalOcean Spaces)`);
  console.log(`🌍 Frontend URL: ${BASE_URL}`);
  console.log('============================================');
});

// ============================================
// 🛑 GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message
  });
});

// ============================================
// ✅ ROOT ROUTE (Added as requested)
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ PickaPrompt API is running!',
    version: '1.0.0'
  });
});

// ============================================
// 🛑 404 CATCH-ALL (Must be last)
// ============================================
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});