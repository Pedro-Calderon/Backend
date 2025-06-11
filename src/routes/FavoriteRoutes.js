const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, deleteFavorite} = require('../Controllers/FavoriteController');
router.post('/add' , addFavorite);
router.get('/:userId', getFavorites);
 router.delete('/:userId/:videoId', deleteFavorite);
module.exports = router;