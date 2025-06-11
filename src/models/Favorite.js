const mongoose = require("mongoose");
  
const FavoriteSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",  
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  title: String,
  thumbnail: String,
  channelTitle: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});
FavoriteSchema.index({ userId: 1, videoId: 1 }, { unique: true });


module.exports = mongoose.model("Favorite", FavoriteSchema);
