const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Route to display the upload form and list of uploaded files
app.get('/', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files!');
    }
    res.render('index', { files: files });
  });
});

app.get('/uploads/:fileName', (req, res) => {
  res.sendFile(`${req.params.fileName}`, { root: 'uploads' });
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