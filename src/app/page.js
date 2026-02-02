'use client';

import { useSession } from 'next-auth/react';
import RecipeCard from "@/components/Recipe/RecipeCard";
import { FaSearch, FaBirthdayCake, FaCookie, FaIceCream } from 'react-icons/fa';
import '../styles/home.css';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useAlert } from '@/hooks/useAlert';

export default function Home() {
  const { data: session } = useSession();
  const { showAlert, AlertModal } = useAlert();

  const {
    searchQuery,
    setSearchQuery,
    recipes,
    loading: searchLoading,
    handleSearch,
    handleQuickSearch,
    noResults,
  } = useRecipeSearch();

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
    <div className="container-fluid py-4">
      
      <section className="hero-section text-center mx-auto">
          <h1 className="hero-title">Welcome to Crumbly</h1>
          <p className="hero-subtitle">Find and save your favorite baking recipes!</p>

          <form onSubmit={handleSearch} className="search-container d-flex justify-content-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cupcakes, cookies, or any recipe..."
              className="form-control search-input"
            />
            <button
              type="submit"
              className="search-button ms-2"
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : <><FaSearch /> Search</>}
            </button>
          </form>

          <div className="quick-categories d-flex flex-wrap justify-content-center mt-3">
            {categories.map((cat, index) => (
              <button
                key={index}
                type="button"
                className="btn category-pill m-1"
                onClick={() => handleQuickSearch(cat.name)}
              >
                {cat.icon || cat.emoji} {cat.name[0].toUpperCase() + cat.name.slice(1)}
              </button>
            ))}
          </div>
      </section>

      <section className="recipe-section container">
        {recipes.length > 0 && (
          <h2 className="section-title text-center">
            {searchQuery ? `Results for "${searchQuery}"` : 'Popular Recipes'}
          </h2>
        )}

        {searchLoading ? (
          <div className="loading-container text-center">
            <div className="loading-spinner mx-auto"></div>
            <p>Searching for delicious recipes...</p>
          </div>
        ) : (
          <div className="row g-3 recipe-list justify-content-center">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="col-6 col-md-4 col-lg-2-4 d-flex"
              >
                <RecipeCard
                  recipe={recipe}
                  onSaveToFavorites={() => handleSaveToFavorites(recipe)}
                  isFavorite={!!favorites[recipe.id]}
                />
              </div>
            ))}
          </div>
        )}

        {noResults && !searchLoading && (
          <div className="empty-state text-center">
            <p>No recipes found for {searchQuery}. Try a different search term!</p>
            <p className="empty-caption">
              Perhaps adjust your keywords or click one of the categories above.
            </p>
          </div>
        )}

        {recipes.length === 0 && !searchLoading && !noResults && (
          <div className="empty-state text-center">
            <div className="empty-state-icon"></div>
            <p>Search for recipes to get started!</p>
            <p className="empty-caption">
              Try searching for brownie, cupcake, or click one of the categories above
            </p>
          </div>
        )}
      </section>

      <AlertModal />
    </div>
  );
}
