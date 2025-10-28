import { useState, useCallback } from 'react';
import axios from 'axios';

export const useRecipeSearch = (apiKey) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = useCallback(async (e, query = searchQuery) => {
    if (e) e.preventDefault();

    const q = query.trim();
    if (!q) {
      setRecipes([]);
      setNoResults(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNoResults(false);
    try {
      const response = await axios.get('/api/spoonacular', {
        params: {
          query: q,
          type: 'search',
        }
      });
      const results = response.data.results;
      setRecipes(results);
      setNoResults(results.length === 0);
    } catch (err) {
      console.log("Search error:", err.response?.data || err.message);
      setError(err);
      setRecipes([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleQuickSearch = useCallback((category) => {
    setSearchQuery(category);
    handleSearch(null, category);
  }, [handleSearch]);

  return {
    searchQuery,
    setSearchQuery,
    recipes,
    loading,
    error,
    noResults,
    handleSearch,
    handleQuickSearch,
  };
};
