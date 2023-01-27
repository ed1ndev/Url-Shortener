var express = require('express');
var router = express.Router();
const { QuickDB } = require('quick.db');

// Initialize the database
const db = new QuickDB();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

function generateShortCode() {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return shortCode;
}

// Create a new short link
router.post('/shorten', async (req, res) => {
  // Generate a unique short code
  let shortCode = generateShortCode();
  // Check if the short code already exist in the database
  while(await db.has(shortCode)){
    shortCode = generateShortCode();
  }
  console.log(req.body)
  // Get the long URL from the request body
  const longUrl = req.body.longUrl;
  // Save the long URL and short code to the database
  db.set(shortCode, longUrl);
  // Send the short code back to the client
  res.send({ shortCode });
});

// Redirect to the original URL when a short link is visited
router.get('/:shortCode', async (req, res) => {
  // Get the short code from the URL
  const shortCode = req.params.shortCode;
  // Get the original URL from the database
  const longUrl = await db.get(shortCode);
  // Redirect the user to the original URL
  res.redirect(longUrl);
});

module.exports = router;
