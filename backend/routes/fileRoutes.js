const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { restrictToTier } = require('../middleware/auth');
const { uploadFile } = require('../controllers/fileController');

router.post('/upload', restrictToTier, upload.single('file'), uploadFile);

module.exports = router;