'use client';

import { useSession } from 'next-auth/react';
import RecipeCard from "@/components/RecipeCard";
import { FaSearch, FaBirthdayCake, FaCookie, FaIceCream } from 'react-icons/fa';
import '../styles/home.css';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useAlert } from '@/hooks/useAlert';


export default function Home() {
  const { data: session} = useSession();
  const { showAlert, AlertModal } = useAlert();

  const {
    searchQuery,
    setSearchQuery,
    recipes,
    loading: searchLoading,
    handleSearch,
    handleQuickSearch,
    noResults,
  } = useRecipeSearch(process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY);

  const { favorites, toggleFavorite } = useFavorites(session?.user?.id);
  
  const handleSaveToFavorites = async (recipe) => {
    if (!session?.user?.id) {
      showAlert({
        title: 'Sign In Required',
        message: 'Please sign in to save recipes to your favorites.',
        variant: 'info'
      });
      return;
    }
    await toggleFavorite(recipe);
  };

  const categories = [
    { name: 'cupcake', icon: <FaBirthdayCake /> },
    { name: 'cookie', icon: <FaCookie /> },
    { name: 'cake', emoji: '🎂' },
    { name: 'pie', emoji: '🥧' },
    { name: 'ice cream', icon: <FaIceCream /> }
  ];

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
          <button type="submit" className="search-button" disabled={searchLoading}>
            {searchLoading ? 'Searching...' : <><FaSearch /> Search</>}
          </button>
        </form>

        <div className="quick-categories">
          {categories.map((cat, index) => (
            <button 
            key={index} 
            className='category-pill' 
            onClick={() => handleQuickSearch(cat.name)}
            type='button'>
              {cat.icon || cat.emoji} {cat.name[0].toUpperCase() + cat.name.slice(1)}
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

        {searchLoading ? (
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
                onSaveToFavorites={() => handleSaveToFavorites(recipe)}
                isFavorite={!!favorites[recipe.id]}
              />
            ))}
          </div>
        )}

        {noResults && !searchLoading && (
          <div className="empty-state">
            <p>No recipes found for {searchQuery}. Try a different search term!</p>
            <p className="empty-caption">Perhaps adjust your keywords or click one of the categories above.</p>
          </div>
        )}

        {recipes.length === 0 && !searchLoading && !noResults && (
          <div className="empty-state">
            <div className="empty-state-icon">🧁</div>
            <p>Search for recipes to get started!</p>
            <p className="empty-caption">Try searching for brownie, cupcake, or click one of the categories above</p>
          </div>
        )}
      </div>

      <AlertModal />
    </div>
  );
}
