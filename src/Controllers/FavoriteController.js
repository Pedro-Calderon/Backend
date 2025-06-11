const Favorite = require("../models/Favorite");

const getFavorites = async (req, res) => {
    const { userId } = req.params;

    try {
        const favorites = await Favorite.find({ userId }).sort({ addedAt: -1 });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addFavorite = async (req, res) => {
    console.log("📥 Datos recibidos en req.body:", req.body);

    const { userId, videoId, title, thumbnail, channelTitle } = req.body;
    try{
        if(!userId || !videoId){
            return res.status(400).json({ message: "Faltan datos requeridos" });
        }
        const existeFavorito = await Favorite.findOne({userId, videoId})

        if(existeFavorito){
            return res
            .status(415)
            .json({message: "El video ya está en favoritos"});
        }

        const newFavorito= new Favorite({
            userId,
            videoId,
            title,
            thumbnail,
            channelTitle
        })
        const savedFavorite = await newFavorito.save();
        res
        .status(200)
        .json({ message: "Video añadido a favoritos", favorite: savedFavorite });

    }catch (error){
        res.status(500).json({ message: error.message });
    }
}


const deleteFavorite = async (req, res) => {
    const { userId, videoId } = req.params;

    try {
        const deletedFavorite = await Favorite.findOneAndDelete({ userId, videoId });

        console.log("🗑️ Favorito eliminado:", videoId);
        if (!deletedFavorite) {
            return res.status(404).json({ message: "Favorito no encontrado" });
        }

        res.json({ message: "Favorito eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getFavorites,
    addFavorite,
    deleteFavorite
};