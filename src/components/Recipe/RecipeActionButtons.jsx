import React from 'react';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

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
      <button
        className="view-btn"
        onClick={onViewClick}
        disabled={detailsLoading}
      >
         View
      </button>

      {showFavoriteButton && (
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={() => onSaveToFavorites()}
          disabled={detailsLoading}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
          
        </button>
      )}

      <button
        className="ai-assist-btn "
        onClick={onAIAssistClick}
        disabled={detailsLoading}
      >
       AI Help
      </button>

      {onDelete && (
        <button
          onClick={onDelete}
          disabled={deleting}
          className='delete-btn'
        >
          <FaTrash />
        </button>
      )}
    </>
  );
}
