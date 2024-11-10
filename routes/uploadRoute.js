const express = require('express');
const multer = require('multer');
const cloudinary = require('../server'); // Assuming server.js exports cloudinary
const router = express.Router();

// Set up multer for handling multipart/form-data
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to handle media upload
router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto', // Automatically detects and uploads as image or video
    });
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
});

module.exports = router;
