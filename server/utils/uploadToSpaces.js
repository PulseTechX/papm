const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

// Initialize the DigitalOcean Spaces Client
const spaces = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
  },
  region: process.env.DO_SPACES_REGION || 'nyc3'
});

const uploadToSpaces = async (file, folder = 'prompts') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  let fileBuffer = file.buffer;
  let contentType = file.mimetype;
  let ext = file.originalname.split('.').pop().toLowerCase();

  // ✅ Optimize images with Sharp AND change extension to webp
  if (file.mimetype.startsWith('image/')) {
    fileBuffer = await sharp(file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    
    contentType = 'image/webp';
    ext = 'webp'; // Force the extension to be webp
  }

  // Construct the final filename with the correct extension
  const filename = `${folder}/${timestamp}-${randomString}.${ext}`;

  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: filename,
    Body: fileBuffer,
    ACL: 'public-read',
    ContentType: contentType
  };

  // Execute the upload
  await spaces.send(new PutObjectCommand(params));

  // ✅ Use the blazing fast CDN URL instead of the origin URL
  const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.digitaloceanspaces.com/${filename}`;
  
  return {
    url: publicUrl,
    filename,
    size: fileBuffer.length,
    contentType
  };
};

module.exports = uploadToSpaces;