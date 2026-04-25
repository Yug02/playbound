const express = require('express');
const router = express.Router();
const { 
    registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserAccount, searchPlayers,
    getAllUsers, deleteUserById // Import new admin controllers
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware'); // Import admin middleware

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

router.get('/search', protect, searchPlayers);

// --- NEW: ADMIN PROTECTED ROUTES ---
// Only a logged-in user who is ALSO an admin can access these
router.route('/')
    .get(protect, admin, getAllUsers);

router.route('/:id')
    .delete(protect, admin, deleteUserById);

module.exports = router;