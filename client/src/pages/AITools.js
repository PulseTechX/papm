import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, Star, Zap, Image, Video, PenTool, Code, Music, Mic, Palette, Search, Filter, ChevronDown, ChevronUp, Layers, Wand2, Sparkles, Crop, Brush, Film, Mic2, Bot, MessageSquare, Briefcase, GraduationCap } from 'lucide-react';
import CoffeeButton from '../components/CoffeeButton';
const BASE_URL = 'https://client-theta-coral.vercel.app';
// ⚠️ REPLACE WITH YOUR ACTUAL AFFILIATE LINKS
const AI_TOOLS = [
// 🎨 IMAGE GENERATION - Text to Image (17 Tools)
{
name: 'Midjourney',
description: 'Best AI image generator with stunning artistic quality',
url: 'https://midjourney.com/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-purple-500 to-pink-500',
popular: true,
free: false,
rating: 5
},
{
name: 'DALL-E 3',
description: 'OpenAI\'s powerful image generation model integrated with ChatGPT',
url: 'https://openai.com/dall-e-3',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-green-500 to-emerald-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Stable Diffusion',
description: 'Open-source AI image generation with full control and customization',
url: 'https://stability.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Leonardo AI',
description: 'Professional AI art generation platform for games and design',
url: 'https://leonardo.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-cyan-500 to-blue-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Ideogram',
description: 'AI image generator specialized in text within images',
url: 'https://ideogram.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-purple-500 to-blue-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Playground AI',
description: 'Free AI image generation with multiple model options',
url: 'https://playgroundai.com/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-green-500 to-teal-500',
popular: false,
free: true,
rating: 4
},
{
name: 'SeaArt AI',
description: 'Free AI art generator with anime and realistic styles',
url: 'https://seaart.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-blue-500 to-purple-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Bing Image Creator',
description: 'Microsoft\'s free DALL-E 3 powered image generator',
url: 'https://bing.com/images/create',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Craiyon',
description: 'Free AI image generator formerly known as DALL-E Mini',
url: 'https://craiyon.com/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-yellow-500 to-orange-500',
popular: false,
free: true,
rating: 3
},
{
name: 'NightCafe',
description: 'AI art generator with multiple algorithms and styles',
url: 'https://nightcafe.studio/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
{
name: 'DreamStudio',
description: 'Stability AI\'s official image generation platform',
url: 'https://dreamstudio.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Pixai AI',
description: 'AI art generator specialized in anime-style images',
url: 'https://pixai.art/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-pink-500 to-rose-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Tensor.art',
description: 'Free AI image generator with custom models',
url: 'https://tensor.art/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
{
name: 'LiblibAI',
description: 'Chinese AI image generation platform with Stable Diffusion models',
url: 'https://liblib.art/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-purple-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Tiamat',
description: 'Chinese AI art generation platform',
url: 'https://tiamat.art/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-pink-500 to-purple-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Flux AI',
description: 'Next-generation image generation model with exceptional quality',
url: 'https://flux.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Image,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Recraft AI',
description: 'Professional vector and raster AI design tool',
url: 'https://recraft.ai/',
category: 'Image Generation',
subcategory: 'Text to Image',
icon: Palette,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
// 🎨 IMAGE GENERATION - Image Editing (7 Tools)
{
name: 'Adobe Firefly',
description: 'Adobe\'s AI image generator integrated with Creative Cloud',
url: 'https://firefly.adobe.com/',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Brush,
color: 'from-red-500 to-orange-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Canva AI',
description: 'Design platform with integrated AI image generation and editing',
url: 'https://canva.com/ai',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Palette,
color: 'from-purple-500 to-blue-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Photoshop AI',
description: 'Adobe Photoshop with Generative Fill and AI features',
url: 'https://adobe.com/photoshop',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Brush,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Remove.bg',
description: 'AI background removal tool for images',
url: 'https://remove.bg/',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Crop,
color: 'from-green-500 to-emerald-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Clipdrop',
description: 'AI-powered image editing and enhancement tools',
url: 'https://clipdrop.co/',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Wand2,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Meitu',
description: 'Chinese AI photo and video editing app',
url: 'https://meitu.com/',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Brush,
color: 'from-pink-500 to-rose-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Fotor AI',
description: 'AI-powered photo editor and graphic design tool',
url: 'https://fotor.com/',
category: 'Image Generation',
subcategory: 'Image Editing',
icon: Brush,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
// 🎨 IMAGE GENERATION - Image Enhancement (3 Tools)
{
name: 'Upscale.media',
description: 'AI image upscaler to enhance resolution',
url: 'https://upscale.media/',
category: 'Image Generation',
subcategory: 'Image Enhancement',
icon: Sparkles,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Let\'s Enhance',
description: 'AI photo enhancer and upscaler',
url: 'https://letsenhance.io/',
category: 'Image Generation',
subcategory: 'Image Enhancement',
icon: Sparkles,
color: 'from-purple-500 to-indigo-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Topaz Photo AI',
description: 'Professional AI photo enhancement software',
url: 'https://topazlabs.com/',
category: 'Image Generation',
subcategory: 'Image Enhancement',
icon: Sparkles,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: false,
rating: 5
},
// 🎨 IMAGE GENERATION - AI Avatars (3 Tools)
{
name: 'Lensa AI',
description: 'AI avatar generator from your selfies',
url: 'https://lensa.ai/',
category: 'Image Generation',
subcategory: 'AI Avatars',
icon: Image,
color: 'from-pink-500 to-rose-500',
popular: true,
free: false,
rating: 4
},
{
name: 'Dawn AI',
description: 'AI avatar creation from your photos',
url: 'https://dawna.ai/',
category: 'Image Generation',
subcategory: 'AI Avatars',
icon: Image,
color: 'from-purple-500 to-pink-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Artsmart AI',
description: 'AI avatar and portrait generation',
url: 'https://artsmart.ai/',
category: 'Image Generation',
subcategory: 'AI Avatars',
icon: Palette,
color: 'from-blue-500 to-purple-500',
popular: false,
free: true,
rating: 4
},
// 🎬 VIDEO GENERATION - Text to Video (7 Tools)
{
name: 'Runway ML',
description: 'AI-powered video editing and generation platform',
url: 'https://runwayml.com/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Pika Labs',
description: 'Text-to-video AI generation with impressive quality',
url: 'https://pika.art/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-purple-500 to-orange-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Luma Dream Machine',
description: 'High-quality AI video generation from text',
url: 'https://lumalabs.ai/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-purple-500 to-pink-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Kling AI',
description: 'Chinese AI video generation with realistic motion',
url: 'https://klingai.com/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Haiper AI',
description: 'Short-form AI video generation tool',
url: 'https://haiper.ai/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-orange-500 to-yellow-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Vidu',
description: 'Chinese AI video generation platform',
url: 'https://vidu.com/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Luma AI',
description: '3D capture and AI video generation',
url: 'https://lumalabs.ai/',
category: 'Video Generation',
subcategory: 'Text to Video',
icon: Video,
color: 'from-purple-500 to-pink-500',
popular: true,
free: true,
rating: 5
},
// 🎬 VIDEO GENERATION - AI Avatars (3 Tools)
{
name: 'HeyGen',
description: 'AI avatar and video creation for presentations',
url: 'https://heygen.com/',
category: 'Video Generation',
subcategory: 'AI Avatars',
icon: Video,
color: 'from-blue-500 to-purple-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Synthesia',
description: 'AI video generator with realistic avatars',
url: 'https://synthesia.io/',
category: 'Video Generation',
subcategory: 'AI Avatars',
icon: Video,
color: 'from-green-500 to-emerald-500',
popular: true,
free: false,
rating: 5
},
{
name: 'D-ID',
description: 'AI talking head video generator',
url: 'https://d-id.com/',
category: 'Video Generation',
subcategory: 'AI Avatars',
icon: Video,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: false,
rating: 4
},
// 🎬 VIDEO GENERATION - Video Editing (7 Tools)
{
name: 'InVideo AI',
description: 'Text-to-video AI for marketing and social media',
url: 'https://invideo.io/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Veed.io',
description: 'Online video editor with AI features',
url: 'https://veed.io/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-purple-500 to-blue-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Descript',
description: 'AI-powered video and podcast editing',
url: 'https://descript.com/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Opus Clip',
description: 'AI tool to create short clips from long videos',
url: 'https://opus.pro/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-purple-500 to-pink-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Fliki',
description: 'Text-to-video with AI voices and stock footage',
url: 'https://fliki.ai/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
{
name: 'CapCut AI',
description: 'ByteDance\'s AI-powered video editing tool',
url: 'https://capcut.com/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-gray-700 to-gray-900',
popular: true,
free: true,
rating: 5
},
{
name: 'Captions AI',
description: 'AI-powered video captions and editing for social media',
url: 'https://captions.ai/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-pink-500 to-rose-500',
popular: true,
free: false,
rating: 4
},
{
name: 'Wondershare Filmora',
description: 'AI-powered video editing software',
url: 'https://filmora.wondershare.com/',
category: 'Video Generation',
subcategory: 'Video Editing',
icon: Film,
color: 'from-green-500 to-emerald-500',
popular: true,
free: false,
rating: 4
},
// ✍️ WRITING - Content Writing (4 Tools)
{
name: 'Jasper AI',
description: 'AI writing assistant for content creators and marketers',
url: 'https://jasper.ai/',
category: 'Writing',
subcategory: 'Content Writing',
icon: PenTool,
color: 'from-orange-500 to-yellow-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Copy.ai',
description: 'AI copywriting tool for marketing and sales',
url: 'https://copy.ai/',
category: 'Writing',
subcategory: 'Content Writing',
icon: PenTool,
color: 'from-pink-500 to-rose-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Writesonic',
description: 'AI writing for articles, ads, and content',
url: 'https://writesonic.com/',
category: 'Writing',
subcategory: 'Content Writing',
icon: PenTool,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Rytr',
description: 'Affordable AI writing assistant for all content types',
url: 'https://rytr.me/',
category: 'Writing',
subcategory: 'Content Writing',
icon: PenTool,
color: 'from-purple-500 to-blue-500',
popular: false,
free: true,
rating: 4
},
// ✍️ WRITING - Grammar & Editing (4 Tools)
{
name: 'Grammarly',
description: 'AI writing assistant and grammar checker',
url: 'https://grammarly.com/',
category: 'Writing',
subcategory: 'Grammar & Editing',
icon: PenTool,
color: 'from-green-500 to-emerald-500',
popular: true,
free: true,
rating: 5
},
{
name: 'QuillBot',
description: 'AI paraphrasing and writing enhancement tool',
url: 'https://quillbot.com/',
category: 'Writing',
subcategory: 'Grammar & Editing',
icon: PenTool,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Wordtune',
description: 'AI writing companion for rewriting and editing',
url: 'https://wordtune.com/',
category: 'Writing',
subcategory: 'Grammar & Editing',
icon: PenTool,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Hemingway Editor',
description: 'AI-powered writing clarity and readability tool',
url: 'https://hemingwayapp.com/',
category: 'Writing',
subcategory: 'Grammar & Editing',
icon: PenTool,
color: 'from-orange-500 to-yellow-500',
popular: false,
free: true,
rating: 4
},
// ✍️ WRITING - SEO Writing (3 Tools)
{
name: 'Surfer SEO',
description: 'AI-powered content optimization for SEO',
url: 'https://surferseo.com/',
category: 'Writing',
subcategory: 'SEO Writing',
icon: PenTool,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Frase',
description: 'AI content brief and optimization tool',
url: 'https://frase.io/',
category: 'Writing',
subcategory: 'SEO Writing',
icon: PenTool,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Anyword',
description: 'AI copywriting with predictive performance scores',
url: 'https://anyword.com/',
category: 'Writing',
subcategory: 'SEO Writing',
icon: PenTool,
color: 'from-orange-500 to-red-500',
popular: false,
free: false,
rating: 4
},
// 💬 CHAT - AI Assistants (11 Tools)
{
name: 'ChatGPT Plus',
description: 'Advanced AI chatbot by OpenAI with GPT-4',
url: 'https://chat.openai.com/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-green-500 to-teal-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Claude AI',
description: 'Anthropic\'s helpful, harmless AI assistant',
url: 'https://claude.ai/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-orange-500 to-amber-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Google Gemini',
description: 'Google\'s multimodal AI assistant',
url: 'https://gemini.google.com/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-blue-500 to-purple-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Microsoft Copilot',
description: 'AI assistant integrated with Windows and Office',
url: 'https://copilot.microsoft.com/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 4
},
{
name: 'DeepSeek',
description: 'Chinese AI assistant with advanced reasoning capabilities',
url: 'https://deepseek.com/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Qwen (Alibaba)',
description: 'Chinese AI model by Alibaba with multilingual support',
url: 'https://qwen.ai/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-orange-500 to-red-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Grok (xAI)',
description: 'Elon Musk\'s AI with real-time X/Twitter integration',
url: 'https://grok.x.ai/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-gray-700 to-gray-900',
popular: true,
free: false,
rating: 4
},
{
name: 'Mistral AI',
description: 'European open-weight AI models with excellent performance',
url: 'https://mistral.ai/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-orange-500 to-yellow-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Baidu ERNIE Bot',
description: 'Chinese AI assistant by Baidu with search integration',
url: 'https://yiyan.baidu.com/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Doubao (ByteDance)',
description: 'Chinese AI assistant by ByteDance (TikTok parent)',
url: 'https://doubao.com/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-pink-500 to-rose-500',
popular: false,
free: true,
rating: 4
},
{
name: 'MiniMax',
description: 'Chinese AI company with advanced language models',
url: 'https://minimax.io/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-purple-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Zhipu AI',
description: 'Chinese AI company with GLM language models',
url: 'https://zhipu.ai/',
category: 'Chat & Assistant',
subcategory: 'AI Assistants',
icon: Bot,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
// 💬 CHAT - AI Search (3 Tools)
{
name: 'Perplexity AI',
description: 'AI-powered search engine with citations',
url: 'https://perplexity.ai/',
category: 'Chat & Assistant',
subcategory: 'AI Search',
icon: Search,
color: 'from-cyan-500 to-blue-500',
popular: true,
free: true,
rating: 5
},
{
name: 'You.com',
description: 'AI search engine with customizable results',
url: 'https://you.com/',
category: 'Chat & Assistant',
subcategory: 'AI Search',
icon: Search,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Perplexity Pro',
description: 'AI search with advanced features and unlimited queries',
url: 'https://perplexity.ai/pro',
category: 'Search',
subcategory: 'AI Search',
icon: Search,
color: 'from-cyan-500 to-blue-500',
popular: true,
free: false,
rating: 5
},
// 💬 CHAT - Character Chat (2 Tools)
{
name: 'Character.ai',
description: 'Chat with AI characters and celebrities',
url: 'https://character.ai/',
category: 'Chat & Assistant',
subcategory: 'Character Chat',
icon: MessageSquare,
color: 'from-purple-500 to-pink-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Poe',
description: 'Multi-bot AI chat platform by Quora',
url: 'https://poe.com/',
category: 'Chat & Assistant',
subcategory: 'Character Chat',
icon: MessageSquare,
color: 'from-orange-500 to-red-500',
popular: false,
free: true,
rating: 4
},
// 🎵 AUDIO - Text to Speech (5 Tools)
{
name: 'ElevenLabs',
description: 'AI voice generation and text-to-speech',
url: 'https://elevenlabs.io/',
category: 'Audio',
subcategory: 'Text to Speech',
icon: Mic,
color: 'from-purple-500 to-pink-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Murf AI',
description: 'Professional AI voiceover studio',
url: 'https://murf.ai/',
category: 'Audio',
subcategory: 'Text to Speech',
icon: Mic2,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Play.ht',
description: 'AI voice generator for podcasts and videos',
url: 'https://play.ht/',
category: 'Audio',
subcategory: 'Text to Speech',
icon: Mic2,
color: 'from-purple-500 to-blue-500',
popular: false,
free: true,
rating: 4
},
{
name: 'WellSaid Labs',
description: 'Enterprise AI voiceover platform',
url: 'https://wellsaidlabs.com/',
category: 'Audio',
subcategory: 'Text to Speech',
icon: Mic2,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Adobe Podcast AI',
description: 'AI audio enhancement for podcasts and voice recordings',
url: 'https://podcast.adobe.com/',
category: 'Audio',
subcategory: 'Text to Speech',
icon: Mic,
color: 'from-purple-500 to-blue-500',
popular: false,
free: true,
rating: 4
},
// 🎵 AUDIO - Music Generation (4 Tools)
{
name: 'Suno AI',
description: 'AI music generation from text prompts',
url: 'https://suno.ai/',
category: 'Audio',
subcategory: 'Music Generation',
icon: Music,
color: 'from-red-500 to-orange-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Udio',
description: 'AI music creation with full songs',
url: 'https://udio.com/',
category: 'Audio',
subcategory: 'Music Generation',
icon: Music,
color: 'from-purple-500 to-pink-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Soundraw',
description: 'AI music generator for content creators',
url: 'https://soundraw.io/',
category: 'Audio',
subcategory: 'Music Generation',
icon: Music,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Aiva',
description: 'AI composer for classical and cinematic music',
url: 'https://aiva.ai/',
category: 'Audio',
subcategory: 'Music Generation',
icon: Music,
color: 'from-purple-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
// 🎵 AUDIO - Voice Cloning (2 Tools)
{
name: 'Resemble AI',
description: 'AI voice cloning and generation platform',
url: 'https://resemble.ai/',
category: 'Audio',
subcategory: 'Voice Cloning',
icon: Mic,
color: 'from-green-500 to-emerald-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Descript Overdub',
description: 'AI voice cloning for podcast editing',
url: 'https://descript.com/overdub',
category: 'Audio',
subcategory: 'Voice Cloning',
icon: Mic,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: false,
rating: 4
},
// 💻 CODING - Code Assistants (5 Tools)
{
name: 'GitHub Copilot',
description: 'AI pair programmer for developers',
url: 'https://github.com/copilot',
category: 'Coding',
subcategory: 'Code Assistants',
icon: Code,
color: 'from-gray-700 to-gray-900',
popular: true,
free: false,
rating: 5
},
{
name: 'GitHub Copilot X',
description: 'Next-gen AI pair programmer with chat and voice',
url: 'https://github.com/copilot',
category: 'Coding',
subcategory: 'Code Assistants',
icon: Code,
color: 'from-gray-700 to-gray-900',
popular: true,
free: false,
rating: 5
},
{
name: 'Cursor',
description: 'AI-powered code editor built for developers',
url: 'https://cursor.sh/',
category: 'Coding',
subcategory: 'Code Assistants',
icon: Code,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Tabnine',
description: 'AI code completion for multiple IDEs',
url: 'https://tabnine.com/',
category: 'Coding',
subcategory: 'Code Assistants',
icon: Code,
color: 'from-blue-500 to-cyan-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Codeium',
description: 'Free AI code completion and chat',
url: 'https://codeium.com/',
category: 'Coding',
subcategory: 'Code Assistants',
icon: Code,
color: 'from-purple-500 to-blue-500',
popular: false,
free: true,
rating: 4
},
// 💻 CODING - AI IDEs (4 Tools)
{
name: 'Replit AI',
description: 'AI-assisted online coding platform',
url: 'https://replit.com/',
category: 'Coding',
subcategory: 'AI IDEs',
icon: Code,
color: 'from-orange-500 to-yellow-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Windsurf',
description: 'Next-gen AI-powered IDE',
url: 'https://windsurf.ai/',
category: 'Coding',
subcategory: 'AI IDEs',
icon: Code,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Bolt.new',
description: 'AI web development in the browser',
url: 'https://bolt.new/',
category: 'Coding',
subcategory: 'AI IDEs',
icon: Code,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 5
},
{
name: 'v0.dev',
description: 'AI-powered UI generation by Vercel',
url: 'https://v0.dev/',
category: 'Coding',
subcategory: 'AI IDEs',
icon: Code,
color: 'from-gray-700 to-gray-900',
popular: true,
free: true,
rating: 5
},
// 🎯 PRODUCTIVITY - Automation (2 Tools)
{
name: 'Zapier',
description: 'AI automation for connecting apps',
url: 'https://zapier.com/',
category: 'Productivity',
subcategory: 'Automation',
icon: Zap,
color: 'from-orange-500 to-red-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Make.com',
description: 'Visual automation platform with AI',
url: 'https://make.com/',
category: 'Productivity',
subcategory: 'Automation',
icon: Zap,
color: 'from-purple-500 to-blue-500',
popular: true,
free: true,
rating: 5
},
// 🎯 PRODUCTIVITY - Notes & Workspace (3 Tools)
{
name: 'Notion AI',
description: 'AI-powered workspace and notes',
url: 'https://notion.so/ai',
category: 'Productivity',
subcategory: 'Notes & Workspace',
icon: Layers,
color: 'from-gray-600 to-gray-800',
popular: true,
free: false,
rating: 5
},
{
name: 'Mem.ai',
description: 'AI-powered note-taking and organization',
url: 'https://mem.ai/',
category: 'Productivity',
subcategory: 'Notes & Workspace',
icon: Layers,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Obsidian AI',
description: 'AI-powered knowledge base and note-taking',
url: 'https://obsidian.md/',
category: 'Productivity',
subcategory: 'Notes & Workspace',
icon: Layers,
color: 'from-purple-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
// 🎯 PRODUCTIVITY - Meeting Assistants (2 Tools)
{
name: 'Otter.ai',
description: 'AI meeting notes and transcription',
url: 'https://otter.ai/',
category: 'Productivity',
subcategory: 'Meeting Assistants',
icon: Mic,
color: 'from-blue-500 to-cyan-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Fireflies.ai',
description: 'AI meeting assistant and note-taker',
url: 'https://fireflies.ai/',
category: 'Productivity',
subcategory: 'Meeting Assistants',
icon: Mic,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
// 🎯 PRODUCTIVITY - Calendar & Tasks (2 Tools)
{
name: 'Motion',
description: 'AI calendar and task management',
url: 'https://usemotion.com/',
category: 'Productivity',
subcategory: 'Calendar & Tasks',
icon: Zap,
color: 'from-purple-500 to-pink-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Clockwise',
description: 'AI calendar optimization for teams',
url: 'https://clockwise.com/',
category: 'Productivity',
subcategory: 'Calendar & Tasks',
icon: Zap,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
// 📊 BUSINESS - CRM & Sales (2 Tools)
{
name: 'HubSpot AI',
description: 'AI-powered CRM and marketing platform',
url: 'https://hubspot.com/',
category: 'Business',
subcategory: 'CRM & Sales',
icon: Briefcase,
color: 'from-orange-500 to-red-500',
popular: true,
free: true,
rating: 5
},
{
name: 'Salesforce Einstein',
description: 'AI for sales and customer service',
url: 'https://salesforce.com/einstein',
category: 'Business',
subcategory: 'CRM & Sales',
icon: Briefcase,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: false,
rating: 5
},
// 📊 BUSINESS - Marketing (4 Tools)
{
name: 'AdCreative.ai',
description: 'AI-generated ad creatives and banners',
url: 'https://adcreative.ai/',
category: 'Business',
subcategory: 'Marketing',
icon: Image,
color: 'from-purple-500 to-blue-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Mutiny',
description: 'AI personalization for B2B websites',
url: 'https://mutinyhq.com/',
category: 'Business',
subcategory: 'Marketing',
icon: Zap,
color: 'from-purple-500 to-pink-500',
popular: false,
free: false,
rating: 4
},
{
name: 'Lavender',
description: 'AI email coaching for sales teams',
url: 'https://lavender.ai/',
category: 'Business',
subcategory: 'Marketing',
icon: PenTool,
color: 'from-purple-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Xiaohongshu AI',
description: 'Chinese social platform with AI content tools',
url: 'https://xiaohongshu.com/',
category: 'Business',
subcategory: 'Marketing',
icon: Briefcase,
color: 'from-red-500 to-pink-500',
popular: false,
free: true,
rating: 4
},
// 🎓 EDUCATION - Learning Platforms (2 Tools)
{
name: 'Khanmigo',
description: 'AI tutor by Khan Academy',
url: 'https://khanacademy.org/khanmigo',
category: 'Education',
subcategory: 'Learning Platforms',
icon: GraduationCap,
color: 'from-green-500 to-emerald-500',
popular: true,
free: false,
rating: 5
},
{
name: 'Quizlet AI',
description: 'AI-powered study tools and flashcards',
url: 'https://quizlet.com/ai',
category: 'Education',
subcategory: 'Learning Platforms',
icon: GraduationCap,
color: 'from-blue-500 to-indigo-500',
popular: true,
free: true,
rating: 4
},
// 🎓 EDUCATION - Presentations (2 Tools)
{
name: 'Tome',
description: 'AI-powered presentation and storytelling',
url: 'https://tome.app/',
category: 'Education',
subcategory: 'Presentations',
icon: Zap,
color: 'from-orange-500 to-red-500',
popular: true,
free: true,
rating: 4
},
{
name: 'Gamma',
description: 'AI presentation and document creation',
url: 'https://gamma.app/',
category: 'Education',
subcategory: 'Presentations',
icon: Zap,
color: 'from-purple-500 to-blue-500',
popular: true,
free: true,
rating: 5
},
// 🔍 SEARCH - Research (2 Tools)
{
name: 'Consensus',
description: 'AI search engine for scientific research',
url: 'https://consensus.app/',
category: 'Search',
subcategory: 'Research',
icon: Search,
color: 'from-blue-500 to-indigo-500',
popular: false,
free: true,
rating: 4
},
{
name: 'Elicit',
description: 'AI research assistant for academics',
url: 'https://elicit.org/',
category: 'Search',
subcategory: 'Research',
icon: Search,
color: 'from-purple-500 to-pink-500',
popular: false,
free: true,
rating: 4
}
];
// Organize categories with subcategories
const CATEGORY_STRUCTURE = {
'Image Generation': ['Text to Image', 'Image Editing', 'Image Enhancement', 'AI Avatars'],
'Video Generation': ['Text to Video', 'AI Avatars', 'Video Editing'],
'Writing': ['Content Writing', 'Grammar & Editing', 'SEO Writing'],
'Chat & Assistant': ['AI Assistants', 'AI Search', 'Character Chat'],
'Audio': ['Text to Speech', 'Music Generation', 'Voice Cloning'],
'Coding': ['Code Assistants', 'AI IDEs'],
'Productivity': ['Automation', 'Notes & Workspace', 'Meeting Assistants', 'Calendar & Tasks'],
'Business': ['CRM & Sales', 'Marketing'],
'Education': ['Learning Platforms', 'Presentations'],
'Search': ['AI Search', 'Research']
};
const AITools = () => {
const [selectedCategory, setSelectedCategory] = useState('All');
const [selectedSubcategory, setSelectedSubcategory] = useState('All');
const [searchQuery, setSearchQuery] = useState('');
const [expandedCategories, setExpandedCategories] = useState({});
// Get unique categories
const categories = ['All', ...Object.keys(CATEGORY_STRUCTURE)];
// Get subcategories for selected category
const getSubcategories = (category) => {
if (category === 'All') return ['All'];
return ['All', ...(CATEGORY_STRUCTURE[category] || [])];
};
const subcategories = getSubcategories(selectedCategory);
// Filter tools
const filteredTools = AI_TOOLS.filter(tool => {
const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
const matchesSubcategory = selectedSubcategory === 'All' || tool.subcategory === selectedSubcategory;
const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
tool.description.toLowerCase().includes(searchQuery.toLowerCase());
return matchesCategory && matchesSubcategory && matchesSearch;
});
// Toggle category expansion
const toggleCategory = (category) => {
setExpandedCategories(prev => ({
...prev,
[category]: !prev[category]
}));
};
// Group filtered tools by category
const toolsByCategory = filteredTools.reduce((acc, tool) => {
if (!acc[tool.category]) {
acc[tool.category] = {};
}
if (!acc[tool.category][tool.subcategory]) {
acc[tool.category][tool.subcategory] = [];
}
acc[tool.category][tool.subcategory].push(tool);
return acc;
}, {});
return (
<div className="min-h-screen py-12 animate-fade-in pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
<Helmet>
<title>Top AI Tools Directory 2026 | AI Prompt Library</title>
<meta name="description" content="Discover the best AI tools for image generation, video, writing, coding, and productivity. A curated directory of 110+ premium and free AI software." />
<link rel="canonical" href={`${BASE_URL}/ai-tools`} />
</Helmet>
<div className="max-w-7xl mx-auto px-4">
{/* Premium Header (Compact Version) */}
<header className="text-center max-w-2xl mx-auto mb-8 pt-4 relative">
{/* Reduced ambient glow height */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-32 bg-yellow-500/10 blur-[80px] pointer-events-none -z-10"></div>
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 border" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
<Zap size={12} style={{ color: 'var(--accent-yellow)' }} />
<span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-yellow)' }}>The Ultimate Directory</span>
</div>
<h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white">
Top 110+ <span style={{ color: 'var(--accent-yellow)' }}>AI Tools</span>
</h1>
<p className="text-sm md:text-base font-light mb-5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
Stop searching. Start creating. Find the perfect AI software for your exact needs, organized by category and use-case.
</p>
<div className="flex justify-center mb-2">
<CoffeeButton size="small" />
</div>
</header>
{/* Back to Gallery */}
<Link
to="/"
className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white bg-[#12121a] px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 mb-8"
style={{ color: 'var(--text-secondary)' }}
>
<ArrowLeft size={16} />
<span>Back to Gallery</span>
</Link>
{/* Floating Search & Filter Dock */}
<div className="mb-12 sticky top-[72px] z-40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 26, 37, 0.85)', borderColor: 'var(--border-light)' }}>
{/* Search Bar */}
<div className="relative mb-4">
<Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
<input
type="text"
placeholder="Search tools, platforms, or features..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full text-sm pl-11 pr-4 py-3.5 rounded-xl transition-all outline-none"
style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
onFocus={(e) => e.target.style.borderColor = 'var(--accent-yellow)'}
onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
/>
</div>
{/* Category Filter Chips */}
<div className="flex flex-wrap items-center gap-2 mb-3">
<div className="flex items-center gap-1.5 mr-2">
<Filter size={14} style={{ color: 'var(--text-muted)' }} />
<span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Category:</span>
</div>
{categories.map((category) => (
<button
key={category}
onClick={() => {
setSelectedCategory(category);
setSelectedSubcategory('All');
}}
className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover-lift"
style={{
backgroundColor: selectedCategory === category ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
color: selectedCategory === category ? '#000' : 'var(--text-secondary)',
border: selectedCategory === category ? 'none' : '1px solid var(--border-light)',
boxShadow: selectedCategory === category ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none'
}}
>
{category}
</button>
))}
</div>
{/* Subcategory Filter Chips */}
{selectedCategory !== 'All' && (
<div className="flex flex-wrap items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
<div className="flex items-center gap-1.5 mr-2">
<Layers size={14} style={{ color: 'var(--text-muted)' }} />
<span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Subcategory:</span>
</div>
{subcategories.map((subcategory) => (
<button
key={subcategory}
onClick={() => setSelectedSubcategory(subcategory)}
className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
style={{
backgroundColor: selectedSubcategory === subcategory ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
color: selectedSubcategory === subcategory ? 'var(--accent-yellow)' : 'var(--text-muted)',
border: `1px solid ${selectedSubcategory === subcategory ? 'var(--accent-yellow)' : 'var(--border-medium)'}`
}}
onMouseEnter={(e) => { if(selectedSubcategory !== subcategory) { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
onMouseLeave={(e) => { if(selectedSubcategory !== subcategory) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
>
{subcategory}
</button>
))}
</div>
)}
</div>
{/* Results Counter */}
<p className="text-xs font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>
Showing {filteredTools.length} tools
</p>
{/* Tools Display */}
{selectedCategory === 'All' ? (
// Show all categories expanded
Object.keys(CATEGORY_STRUCTURE).map((category) => {
const categoryTools = filteredTools.filter(t => t.category === category);
if (categoryTools.length === 0) return null;
return (
<div key={category} className="mb-12">
<div
className="flex items-center justify-between mb-6 cursor-pointer group"
onClick={() => toggleCategory(category)}
>
<h2 className="text-2xl font-bold text-white flex items-center gap-3 transition-colors group-hover:text-yellow-400">
<span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: 'var(--accent-yellow)' }}></span>
{category}
<span className="px-3 py-1 rounded-full text-xs font-bold bg-[#12121a] border border-white/5" style={{ color: 'var(--text-secondary)' }}>
{categoryTools.length}
</span>
</h2>
<div className="p-2 rounded-full transition-colors group-hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
{expandedCategories[category] !== false ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
</div>
</div>
{(expandedCategories[category] !== false) && (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
{categoryTools.map((tool, index) => (
<ToolCard key={index} tool={tool} />
))}
</div>
)}
</div>
);
})
) : (
// Show selected category with subcategories
Object.keys(toolsByCategory[selectedCategory] || {}).map((subcategory) => {
const subcategoryTools = toolsByCategory[selectedCategory][subcategory];
if (!subcategoryTools || subcategoryTools.length === 0) return null;
return (
<div key={subcategory} className="mb-10">
<h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
<span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: 'var(--border-medium)' }}></span>
{subcategory}
<span className="px-3 py-1 rounded-full text-xs font-bold bg-[#12121a] border border-white/5" style={{ color: 'var(--text-secondary)' }}>
{subcategoryTools.length}
</span>
</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
{subcategoryTools.map((tool, index) => (
<ToolCard key={index} tool={tool} />
))}
</div>
</div>
);
})
)}
{/* No Results Fallback */}
{filteredTools.length === 0 && (
<div className="text-center py-20 card border-dashed max-w-2xl mx-auto">
<div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
<Search size={32} style={{ color: 'var(--text-muted)' }} />
</div>
<p className="text-lg font-medium text-white mb-2">No tools found matching your criteria.</p>
<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search query.</p>
</div>
)}
{/* Advertisement Placeholder */}
<div className="mt-16 rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-light)' }}>
<div className="h-24 sm:h-32 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
<p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
<p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>728 x 90 Banner Space</p>
</div>
</div>
</div>
</div>
);
};
// Tool Card Component
const ToolCard = ({ tool }) => {
return (
<a
href={tool.url}
target="_blank"
rel="noopener noreferrer"
className="group relative flex flex-col h-full card p-5 hover-lift transition-all duration-300 border-glow"
>
{/* Floating Badges */}
<div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
{tool.popular && (
<span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-yellow)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
<Star size={10} fill="currentColor" /> Popular
</span>
)}
{tool.free && (
<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
Free Option
</span>
)}
</div>
{/* Icon Graphic */}
<div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg shrink-0`}>
<tool.icon size={24} className="text-white" />
</div>
{/* Text Content */}
<div className="flex-1 flex flex-col">
<h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
{tool.name}
</h3>
{/* Rating Stars */}
<div className="flex items-center gap-1 mb-3">
{[...Array(5)].map((_, i) => (
<Star
key={i}
size={12}
style={{ color: i < tool.rating ? 'var(--accent-yellow)' : 'var(--bg-hover)' }}
fill={i < tool.rating ? 'currentColor' : 'none'}
/>
))}
</div>
<p className="text-sm line-clamp-2 mb-4 flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
{tool.description}
</p>
{/* Footer Meta & Action */}
<div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-light)' }}>
<span className="text-[10px] font-bold uppercase tracking-wider truncate mr-2" style={{ color: 'var(--text-muted)' }}>
{tool.subcategory}
</span>
<div className="flex items-center gap-1.5 text-xs font-bold transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-primary)' }}>
<span>Visit</span>
<ExternalLink size={12} />
</div>
</div>
</div>
</a>
);
};
export default AITools;