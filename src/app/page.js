'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import RecipeCard from "@/components/RecipeCard";
import { FaSearch, FaBirthdayCake, FaCookie, FaIceCream } from 'react-icons/fa';
import '../styles/home.css';

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState({});
  const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

  useEffect(() => {
    const loadFavorites = async () => {
      if (!session?.user?.id) return; 
        try {
          const response = await axios.get(`/api/favorites?userId=${session.user.id}`);
          const favoritesMap = {};
          response.data.favorites.forEach(fav => {
            favoritesMap[fav.recipeId] = true;
          });
          setFavorites(favoritesMap);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
    };

    loadFavorites();
  }, [session?.user?.id]);

  const handleSearch = async (e, query) => {
    if(e) e.preventDefault();
    const q = query || searchQuery;
    if (!q.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query: q,
          apiKey: apiKey,
          number: 50,
          addRecipeInformation: true,
          includeNutrition: false, //try removing
          instructionsRequired: true
        }
      });
       console.log('API response:', response.data);
      setRecipes(response.data.results);
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (category) => {
    setSearchQuery(category);
    handleSearch(null, category);
  };

  const handleSaveToFavorites = async (recipe) => {
    if(!session) {
      alert('please sign in to save favorites');
      return;
    }

    const isAlreadyFav = favorites[recipe.id];
    
    try {
      const response = await axios.post('/api/favorites', {
        userId: session.user.id,
        recipeId: recipe.id,
        title: recipe.title,
        image: typeof recipe.image ==='string' ? recipe.image :recipe.image?.url 
      });
      const {isFavorite} = response.data;

      setFavorites(prev => ({
        ...prev,
        [recipe.id]: isFavorite
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to BakeMuse</h1>
        <p className="hero-subtitle">Find and save your favorite baking recipes!</p>
        
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for cupcakes, cookies, or any recipe..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : <><FaSearch /> Search</>}
          </button>
        </form>
        
        <div className="quick-categories">
         {['cupcake', 'cookie', 'cake', 'pie', 'ice cream'].map((cat,index) => (
          <button key={index} className='category-pill' onClick={() => handleQuickSearch(cat)}>
            {cat==='cupcake' && <FaBirthdayCake />}
            {cat === 'cookie' && <FaCookie />}
            {cat === 'ice cream' && <FaIceCream />}
            {cat === 'cake' && '🎂'}
            {cat === 'pie' && '🥧'}
            {cat[0].toUpperCase() + cat.slice(1)}
          </button>
         ))}
        </div>
      </div>

      <div className="recipe-section">
        {recipes.length > 0 && (
          <h2 className="section-title">
            {searchQuery ? `Results for "${searchQuery}"` : 'Popular Recipes'}
          </h2>
        )}
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for delicious recipes...</p>
          </div>
        ) : (
          <div className="recipe-list">
            {recipes.map((recipe) => (
              <RecipeCard  
                key={recipe.id}
                recipe={recipe} 
                onSaveToFavorites={handleSaveToFavorites}
                isFavorite={!!favorites[recipe.id]}
              />
            ))}
          </div>
        )}
        
        {recipes.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">🧁</div>
            <p>Search for recipes to get started!</p>
            <p className="empty-caption">Try searching for brownie, cupcake, or click one of the categories above</p>
          </div>
        )}
      </div>
    </div>
  );
}