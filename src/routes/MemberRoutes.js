const express = require('express');
const { getMembers, addMember, getMemberById, loginMember } = require('../Controllers/MemberControllers');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/' , verifyToken, getMembers);
router.get("/:id", verifyToken, getMemberById);
router.post('/register', addMember);
router.post('/login', loginMember);
module.exports = router;