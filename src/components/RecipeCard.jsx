'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import RecipeModal from './RecipeModal';
import AIChatBox from './AIChatBox/AIChatBox';
import { FaHeart, FaRegHeart, FaEye, FaCommentAlt, FaTrash } from 'react-icons/fa';
import { Button, Card } from 'react-bootstrap';
import '@/styles/recipe.css';


export default function RecipeCard({ recipe, onDelete, isFavorite, onSaveToFavorites}) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Only show favorite button for API recipes
  const showFavoriteButton = !recipe._id; 

  const fetchRecipeDetails = async () => {
    if(recipeDetails) return; 

    setLoading(true);
    try{
      const response = recipe._id 
          ? await axios.get(`/api/recipes?id=${recipe._id}`)
          : await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
              params: {
                apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
                includeNutrition: false
              }
          });
          const data = response.data;
          setRecipeDetails(data.recipe||data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleViewClick = async () => {
      await fetchRecipeDetails();
      setIsModalOpen(true);
    }
 const handleAIAssistClick = async () => {
  await fetchRecipeDetails();
  setShowChat(!showChat);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    setDeleting(true);
    try{
      await onDelete(recipe._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="recipe-card h-100 shadow-sm overflow-hidden">
      <div className="position-relative overflow-hidden">
      <Card.Img
      variant='top'
      src={recipe.image?.url || recipe.image}
      alt={recipe.title}
      className="recipe-image object-fit-contain" />

      <Card.Body className="recipe-card-content d-flex flex-column">
        <Card.Title>{recipe.title}</Card.Title>
        
        <div className="recipe-card-actions mt-auto">
          <Button
            className="view-btn me-2"
            onClick={handleViewClick}
            disabled={loading}
          >
            <FaEye /> {loading ? "Loading..." : "View"}
          </Button>
          
          {showFavoriteButton && (
          <Button 
            variant={isFavorite ? "danger" : "outline-danger"}
            className={`favorite-btn ${isFavorite ? 'favorited' : ''} me-2`}
            onClick={() => onSaveToFavorites(recipe)}
            disabled={loading}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
            {loading ? '...' : ''}
          </Button>
        )}
          
          <Button 
            className="ai-assist-btn me-2"
            onClick={handleAIAssistClick}
          >
            <FaCommentAlt /> AI Help
          </Button>
         
          {recipe._id && (
          <Button onClick={handleDelete} disabled={deleting} size='sm' className='mt-2'>
            {deleting? (
              <span>Deleting...</span>
            ): <FaTrash className="me-1" />
            }
          </Button>
          )}
        </div>
      </Card.Body>
      
      {isModalOpen && recipeDetails && (
        <RecipeModal 
          recipe={recipeDetails} 
          show={isModalOpen}  
          onClose={() => setIsModalOpen(false)}
          onSaveToFavorites={()=> onSaveToFavorites(recipe)}
          isFavorite={isFavorite}
        />
      )}
      
      {showChat && recipeDetails && (
        <AIChatBox 
          recipe={recipeDetails} 
          show={showChat}
          onClose={() => setShowChat(false)}
       />
      )}
      </div>
    </Card>
  );
}