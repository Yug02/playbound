// backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
// Import the new function
const { sendRequest, getUserRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/', protect, getUserRequests);
router.put('/:id', protect, updateRequestStatus); // <-- Add this line

module.exports = router;