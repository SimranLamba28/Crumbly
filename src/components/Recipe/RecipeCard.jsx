'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from 'react-bootstrap';
import '@/styles/recipe.css';
import { useRecipeDetails } from '../hooks/useRecipeDetails';
import { useConfirmation } from '../hooks/useConfirmation';
import RecipeModal from './RecipeModal';
import AIChatBox from './AIChatBox/AIChatBox';
import RecipeActionButtons from './RecipeActionButtons';


export default function RecipeCard({ recipe, onDelete, isFavorite, onSaveToFavorites}) {
  //const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const {
    recipeDetails,
    loading: detailsLoading,
    fetchDetails: fetchRecipeDetails,
    error: fetchError
  } = useRecipeDetails(recipe);

  const { confirm, ConfirmationModal } = useConfirmation();
  const [deleting, setDeleting] = useState(false);

  const showFavoriteButton = !recipe._id;

  const handleViewClick = async () => {
    await fetchRecipeDetails();
    if (!fetchError) {
      setIsModalOpen(true);
    }
  };

  const handleAIAssistClick = async () => {
    await fetchRecipeDetails();
    if (!fetchError) {
      setShowChat(!showChat);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: 'Delete Recipe',
      message: 'Are you sure you want to delete this recipe? This action cannot be undone.'
    });

    if (!isConfirmed) return;

    setDeleting(true);
    try {
      await onDelete(recipe._id);
    } catch (error) {
      console.error("Error deleting recipe:", error);
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
          className="recipe-image object-fit-contain"
        />
        <Card.Body className="recipe-card-content d-flex flex-column">
          <Card.Title>{recipe.title}</Card.Title>

          <div className="recipe-card-actions mt-auto">
            <RecipeActionButtons
              onViewClick={handleViewClick}
              onAIAssistClick={handleAIAssistClick}
              onDelete={recipe._id ? handleDelete : null}
              onSaveToFavorites={onSaveToFavorites}
              isFavorite={isFavorite}
              showFavoriteButton={showFavoriteButton}
              detailsLoading={detailsLoading}
              deleting={deleting}
            />
          </div>
        </Card.Body>

        {isModalOpen && recipeDetails && (
          <RecipeModal
            recipe={recipeDetails}
            show={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSaveToFavorites={onSaveToFavorites}
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

        <ConfirmationModal />
      </div>
    </Card>
  );
}
