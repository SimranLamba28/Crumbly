'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import RecipeCard from '@/components/RecipeCard';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchFavorites = async () => {
    try {
      const res = await fetch(`/api/favorites?userId=${session.user.id}`);
      const { favorites } = await res.json();
      setFavorites(favorites);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setLoading(false);
    }
  };
      fetchFavorites();
    }
  }, [session]);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          recipeId
        })
      });
      setFavorites(favorites.filter(fav => fav.recipeId !== recipeId));
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  if (!session) {
    return (
      <div className='not-logged'>
        <p>Please sign in to view your favorites</p>
      </div>
    );
  };
    
  if (loading) return <div>Loading favorites...</div>;

  return (
    <div className="favorites-page container">
      <h1 className='my-4'>My Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-5">
        <p className='fs-4'>You havent saved any recipes yet!</p>
        </div>
      ) : (
        <div className="recipe-list">
          {favorites.map(fav => (
            <RecipeCard
              key={fav.recipeId}
              recipe={{
                id: fav.recipeId,
                title: fav.title,
                image: fav.image,
                source: 'api'
              }}
              isFavorite={true}
              onSaveToFavorites={() => handleRemoveFavorite(fav.recipeId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}