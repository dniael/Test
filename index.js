const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static('public'));

// Route to display the upload form
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'views' });
});

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.send(`<h2>File uploaded successfully</h2><a href="${filePath}">View File</a>`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});