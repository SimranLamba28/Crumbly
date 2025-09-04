import React from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaEye, FaCommentAlt, FaTrash } from 'react-icons/fa';

export default function RecipeActionButtons({
  onViewClick,
  onAIAssistClick,
  onDelete,
  onSaveToFavorites,
  isFavorite,
  showFavoriteButton,
  detailsLoading,
  deleting,
}) {
  return (
    <>
      <Button
        className="view-btn me-2"
        onClick={onViewClick}
        disabled={detailsLoading}
      >
        <FaEye /> View
      </Button>

      {showFavoriteButton && (
        <Button
          variant={isFavorite ? "danger" : "outline-danger"}
          className={`favorite-btn ${isFavorite ? 'favorited' : ''} me-2`}
          onClick={() => onSaveToFavorites()}
          disabled={detailsLoading}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
          
        </Button>
      )}

      <Button
        className="ai-assist-btn me-2"
        onClick={onAIAssistClick}
        disabled={detailsLoading}
      >
        <FaCommentAlt /> AI Help
      </Button>

      {onDelete && (
        <Button
          onClick={onDelete}
          disabled={deleting}
          size='sm'
          className='mt-2'
          variant="outline-secondary"
        >
          {deleting ? (
            <span>Deleting...</span>
          ) : <FaTrash className="me-1" />
          }
        </Button>
      )}
    </>
  );
}
