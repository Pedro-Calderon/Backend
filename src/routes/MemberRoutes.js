const express = require('express');
const { getMembers, addMember, getMemberById, loginMember, forgotPassword, resetPassword, validateResetToken } = require('../Controllers/MemberControllers');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const loginLimiter = require('../middleware/rateLimiter');

router.get('/' , verifyToken, getMembers);
router.get("/:id", verifyToken, getMemberById);
router.post('/register', addMember);
router.post('/login', loginLimiter, loginMember);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/validate-token", validateResetToken);
module.exports = router;