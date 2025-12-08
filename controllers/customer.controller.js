import { addFavorite, listFavorites, removeFavorite } from "../service/customer.service.js";


export const addFavoriteController = async (req, res, next) => {
  try {
    res.status(201).json(await addFavorite(req.user.id, req.body.productId));
  } catch (err) { next(err); }
};

export const listFavoritesController = async (req, res, next) => {
  try {
    res.json(await listFavorites(req.user.id));
  } catch (err) { next(err); }
};

export const removeFavoriteController = async (req, res, next) => {
  try {
    const favoriteId = req.params.productId;
    const deleted = await removeFavorite(favoriteId);

    if (!deleted) {
      return res.status(404).json({ error: "Favorito não encontrado" });
    }

    res.json({ message: "Favorite removed" });
  } catch (err) {
    next(err);
  }
};




