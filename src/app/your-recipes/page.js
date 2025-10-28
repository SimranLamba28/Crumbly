'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RecipeCard from '@/components/Recipe/RecipeCard';
import { Container, Spinner, Alert } from 'react-bootstrap';
import '../../styles/userRecipes.css';

export default function YourRecipesPage() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch(`/api/recipes?userId=${session.user.id}`);
        
        if (!response.ok) throw new Error('Failed to load recipes');
        
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        setError('Failed to load your recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [status, session?.user?.id]);

  const handleDelete = async (recipeId) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recipeId, userId: session.user.id })
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading your recipes...</p>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="text-center my-5">
        <Alert variant="warning">
          <h4>Sign in required</h4>
          Please sign in to view your recipes
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-3">
      <h3 className="userRecipes-title">Your Recipes</h3>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {recipes.length === 0 && !error ? (
       <div className="userRecipes-empty text-center">
        <p>You have not added any recipes yet.</p>
        <a href="/add" className='btn-link'>Create your first recipe!</a>
        </div>
      ) : (
        <div className="row userRecipes-grid g-3">
          {recipes.map(recipe => (
            <div key={recipe._id} className="userRecipes-card col-6 col-md-4 col-lg-2-4 d-flex justify-content-center">
              <RecipeCard 
                recipe={recipe}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}