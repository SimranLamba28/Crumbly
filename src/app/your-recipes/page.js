'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import RecipeCard from '@/components/RecipeCard';
import { Container, Spinner, Alert } from 'react-bootstrap';


export default function YourRecipesPage() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRecipeAdded, setNewRecipeAdded] = useState(false);

  const fetchUserRecipes = useCallback(async () => {
    if (status !== 'authenticated') return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/recipes', {
        params: { userId: session.user.id }
      });

      console.log('Fetched recipes:', response.data); // Debug log

      if (response.data.recipes) {
      setRecipes(response.data.recipes);
    } else {
      setError('No recipes found');
    }
    } catch (err) {
      setError('Failed to load your recipes');
      console.error('Error fetching user recipes:', err);
    } finally {
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  useEffect(() => {
    // Check if we're coming from a recipe addition
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('new') === 'true') {
    setNewRecipeAdded(true);
    // Clean the URL
    window.history.replaceState({}, '', '/your-recipes');
  }
    fetchUserRecipes();
  },[fetchUserRecipes]);

  if (status === 'loading' || loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your recipes...</p>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <h4>Sign in required</h4>
          <p>Please sign in to view your recipes.</p>
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: recipeId})
      });
      if (!response.ok) throw new Error('Failed to delete');
      fetchUserRecipes();
    } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete recipe');
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Your Recipes</h1>

      {newRecipeAdded && (
      <Alert variant="success" dismissible onClose={() => setNewRecipeAdded(false)}>
        Recipe added successfully!
      </Alert>
    )}
      
      {recipes.length === 0 ? (
        <Alert variant="info">
          You havent added any recipes yet. Create your first recipe!
        </Alert>
      ) : (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe}
              onSaveToFavorites={() => {}}
              onDelete={handleDeleteRecipe}
              isFavorite={false} // Since these are user's own recipes
             
            />
          ))}
        </div>
      )}
    </Container>
  );
}