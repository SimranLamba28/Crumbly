import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!userId) {
        setFavorites({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/favorites?userId=${userId}`);
        const favoritesMap = {};
        response.data.favorites.forEach(fav => {
          favoritesMap[fav.recipeId] = true;
        });
        setFavorites(favoritesMap);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setError(err);
        setFavorites({});
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  const toggleFavorite = useCallback(async (recipe) => {
    if (!userId) {
      console.warn("Attempted to toggle favorite without a user ID.");
      return;
    }

    const recipeId = recipe.id;
    const isCurrentlyFavorite = !!favorites[recipeId];

    setFavorites(prev => ({
      ...prev,
      [recipeId]: !isCurrentlyFavorite
    }));

    try {
      const imageUrl = typeof recipe.image === 'string' ? recipe.image : recipe.image?.url;
      const response = await axios.post('/api/favorites', {
        userId: userId,
        recipeId: recipeId,
        title: recipe.title,
        image: imageUrl
      });
      const { message, isFavorite } = response.data;
    
      if (isFavorite !== !isCurrentlyFavorite) {
          console.warn("State mismatch detected, re-syncing with backend.");
          setFavorites(prev => ({
              ...prev,
              [recipeId]: isFavorite
          }));
      }
      return { success: true, message, isFavorite };
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setError(err);
      setFavorites(prev => ({
        ...prev,
        [recipeId]: isCurrentlyFavorite
      }));
      return { success: false, message: 'Failed to update favorite.' };
    }
  }, [userId, favorites]); 

  return { favorites, loading, error, toggleFavorite };
};