const path = require('path'); // Move this to Line 1
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); 
const mongoose = require('mongoose');
const fs = require('fs');

// ============================================
// 📦 BULK PROMPT IMPORTER
// Usage: node scripts/bulk-import.js scripts/prompts.csv
// ============================================

const Prompt = require('../models/Prompt');

const generateSlug = (title) => {
  return title.trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// ✅ UPGRADED CSV PARSER: Safely handles commas inside quotes!
const parseCSV = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    // Advanced Regex to split by commas EXCEPT those inside quotes
    const values = [];
    let insideQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Push the last value

    const obj = {};
    headers.forEach((header, index) => {
      // Clean up any remaining quotes around the value
      let cleanValue = values[index] || '';
      if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
        cleanValue = cleanValue.substring(1, cleanValue.length - 1);
      }
      obj[header] = cleanValue;
    });
    return obj;
  });
};

const importPrompts = async (data) => {
  let success = 0;
  let failed = 0;
  let skipped = 0;
  const errors = [];

  console.log(`\n📦 Starting import of ${data.length} prompts...\n`);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    try {
      // Validate required fields
      if (!item.title || !item.promptText || !item.aiModel) {
        errors.push(`Row ${i + 1}: Missing required fields (title, promptText, aiModel)`);
        failed++;
        continue;
      }

      // Check if prompt with same slug already exists
      const slug = generateSlug(item.title);
      const existing = await Prompt.findOne({ slug });
      
      if (existing) {
        console.log(`⚠️  Skipped (duplicate): ${item.title}`);
        skipped++;
        continue;
      }

      // Build prompt object
      const promptData = {
        title: item.title.trim(),
        slug: slug,
        description: item.description?.trim() || '',
        promptText: item.promptText.trim(),
        negativePrompt: item.negativePrompt?.trim() || '',
        aiModel: item.aiModel.trim(),
        industry: item.industry?.trim() || 'Technology',
        topic: item.topic?.trim() || 'Abstract',
        mediaType: item.mediaType?.toLowerCase() || 'image',
        isTrending: item.isTrending === 'true' || item.isTrending === true,
        isPromptOfDay: item.isPromptOfDay === 'true' || item.isPromptOfDay === true,
        mediaUrl: item.mediaUrl?.trim() || '',
        copyCount: 0
      };

      const prompt = new Prompt(promptData);
      await prompt.save();
      success++;
      
      // Progress update every 50 prompts
      if (success % 50 === 0) {
        console.log(`✅ Progress: ${success}/${data.length} imported...`);
      } else {
        console.log(`✅ Imported: ${item.title}`);
      }

    } catch (error) {
      errors.push(`Row ${i + 1} (${item.title}): ${error.message}`);
      failed++;
      console.error(`❌ Failed: ${item.title} - ${error.message}`);
    }
  }

  return { success, failed, skipped, errors };
};

const main = async () => {
  // Get file path from command line argument
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('❌ Please provide a file path!');
    console.log('Usage: node scripts/bulk-import.js scripts/prompts.csv');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  // Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ MongoDB Connected!\n');

  // Read and parse file
  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  const ext = path.extname(absolutePath).toLowerCase();
  
  let data;
  if (ext === '.json') {
    data = JSON.parse(fileContent);
    if (!Array.isArray(data)) {
      console.error('❌ JSON file must contain an array of prompts!');
      process.exit(1);
    }
  } else if (ext === '.csv') {
    data = parseCSV(fileContent);
  } else {
    console.error('❌ Unsupported file format! Use .json or .csv');
    process.exit(1);
  }

  console.log(`📂 File loaded: ${filePath}`);
  console.log(`📊 Total prompts found: ${data.length}`);

  // Import prompts
  const { success, failed, skipped, errors } = await importPrompts(data);

  // Print summary
  console.log('\n============================================');
  console.log('🎉 IMPORT COMPLETE!');
  console.log('============================================');
  console.log(`✅ Successfully imported: ${success}`);
  console.log(`⚠️  Skipped (duplicates): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total processed: ${data.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(err => console.log(`  - ${err}`));
  }

  console.log('============================================\n');
  
  await mongoose.disconnect();
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});