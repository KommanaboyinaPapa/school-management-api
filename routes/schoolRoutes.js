const express = require('express');
const {
  addSchool,
  listSchools
} = require('../controllers/schoolController');

const router = express.Router();

// Add School
router.post('/addSchool', addSchool);

// List Schools sorted by proximity
router.get('/listSchools', listSchools);

module.exports = router;
