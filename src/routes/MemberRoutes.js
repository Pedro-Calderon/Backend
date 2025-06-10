const express = require('express');
const { getMembers, addMember, getMemberById } = require('../Controllers/MemberControllers');
const router = express.Router();

router.get('/', getMembers);
router.get("/:id", getMemberById);
router.post('/', addMember);

module.exports = router;