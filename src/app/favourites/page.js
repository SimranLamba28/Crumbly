'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import RecipeCard from '@/components/Recipe/RecipeCard';
import '../../styles/Favorite.css';

export default function FavoritesPage() {
  const { data: session, status} = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = useCallback (async () => {
    try {
      const res = await fetch(`/api/favorites?userId=${session.user.id}`);
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const { favorites } = await res.json();
      setFavorites(favorites || []);
    } catch (error) {
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchFavorites();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status, fetchFavorites]);

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
      setError('Failed to remove favorite');
      console.error('Failed to remove favorite', error);
    }
  };

  if (!session) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <h4>Sign in required</h4>
          <p>Please sign in to view your favorites.</p>
        </Alert>
      </Container>
    );
  };
    
  if (status === 'loading' || loading) {
    return (
      <Container className='text-center my-5'>
        <Spinner animation='border' />
        <p className='mt-2'>Loading...</p>
      </Container>
    )
  }
  return (
    <Container className="my-3">
      <h3 className="favorites-title">My Favorite Recipes</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {favorites.length === 0 ? (
        <div className="favorites-empty text-center">
          <p>You haven&rsquo;t saved any recipes yet!</p>
        </div>
      ) : (
        <div className="row favorites-grid g-3">
          {favorites.map(fav => (
            <div key={fav.recipeId} className="favorites-card col-6 col-md-4 col-lg-2-4 d-flex justify-content-center ">
              <RecipeCard
                recipe={{
                  id: fav.recipeId,
                  title: fav.title,
                  image: fav.image,
                  source: 'api'
                }}
                isFavorite={true}
                onSaveToFavorites={() => handleRemoveFavorite(fav.recipeId)}
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}