import { useState, useCallback } from 'react';
import axios from 'axios';

export const useRecipeDetails = (recipe) => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (recipeDetails) return;

    setLoading(true);
    setError(null);
    try {
      const response = recipe._id
        ? await axios.get(`/api/recipes?id=${recipe._id}`)
        : await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
            params: {
              apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
              includeNutrition: false
            }
          });
      const data = response.data;
      setRecipeDetails(data.recipe || data);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [recipe, recipeDetails]);

  return { recipeDetails, loading, fetchDetails, error };
};
