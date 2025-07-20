'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function useFavorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/favorites?userId=${session.user.id}`);
          const { favorites } = await res.json();
          const favoritesMap = {};
          favorites.forEach(fav => {
            favoritesMap[fav.recipeId] = true;
          });
          setFavorites(favoritesMap);
        } catch (error) {
          console.error('Failed to fetch favorites', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [session?.user?.id]); // Only re-run when user ID changes

  return { favorites, loading };
}