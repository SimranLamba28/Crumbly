'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from 'react-bootstrap';
import '@/styles/recipe.css';
import { useRecipeDetails } from '../../hooks/useRecipeDetails';
import { useConfirmation } from '../../hooks/useConfirmation';
import RecipeModal from './RecipeModal';
import AIChatBox from '../AIChatBox/AIChatBox';
import RecipeActionButtons from '../Recipe/RecipeActionButtons';
import { useAlert } from '@/hooks/useAlert';

export default function RecipeCard({ recipe, onDelete, isFavorite, onSaveToFavorites}) {

  const { data: session } = useSession();
  const {showAlert, AlertModal} = useAlert();

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
    if(!session?.user?.id){
      showAlert({
        title: 'Sign In Required',
        message: 'Please sign in to use the AI Assistant.',
        variant: 'info'
      })
      return;
    }
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
    <Card className="recipe-card h-100 shadow-sm overflow-hidden d-flex flex-column">
        <Card.Img
          variant='top'
          src={recipe.image?.url || recipe.image || '/images/default recipe.jpg'}
          alt={recipe.title}
          className="recipe-image object-fit-contain"
          loading="lazy"
        />
        <Card.Body className="recipe-card-content d-flex flex-column flex-grow-1">
          <Card.Title className='card-title text center'>{recipe.title}</Card.Title>

          <Card.Footer className='recipe-card-actions d-flex justify-content-between align-items-center'>
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
          </Card.Footer>
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
        <AlertModal />
    </Card>
  );
}
