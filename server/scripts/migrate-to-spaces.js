const mongoose = require('mongoose');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const Prompt = require('../models/Prompt');
const Blog = require('../models/Blog');
const Collection = require('../models/Collection');

require('dotenv').config();

const spaces = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
  },
  region: process.env.DO_SPACES_REGION
});

const migratePrompt = async (prompt) => {
  try {
    // Download from Cloudinary
    const response = await axios.get(prompt.mediaUrl, { responseType: 'arraybuffer' });
    
    // Upload to Spaces
    const filename = `prompts/${prompt._id}-${Date.now()}.webp`;
    await spaces.send(new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filename,
      Body: response.data,
      ACL: 'public-read',
      ContentType: 'image/webp'
    }));

    const newUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${filename}`;
    
    // Update database
    await Prompt.findByIdAndUpdate(prompt._id, { mediaUrl: newUrl });
    console.log(`✅ Migrated: ${prompt.title}`);
  } catch (error) {
    console.error(`❌ Failed: ${prompt.title}`, error.message);
  }
};

const runMigration = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to database');

  const prompts = await Prompt.find({});
  console.log(`📦 Found ${prompts.length} prompts to migrate`);

  for (const prompt of prompts) {
    await migratePrompt(prompt);
  }

  console.log('🎉 Migration complete!');
  process.exit(0);
};

runMigration();