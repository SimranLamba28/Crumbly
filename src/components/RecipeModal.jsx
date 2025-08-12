'use client';

import { useState } from 'react';
import { FaHeart, FaRegHeart, FaTimes, FaDownload } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import useRecipeExport from '@/hooks/useRecipeExport';
import ExportDialog from './ExportDialog';
import RecipeExportTemplate from './RecipeExportTemplate';
import '../styles/recipeModal.css';

export default function RecipeModal({ recipe, show, onClose, onSaveToFavorites, isFavorite }) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { exportRef, downloadImage, downloadPDF } = useRecipeExport();

  if (!recipe) return null;

  const userRecipe = recipe.source === 'user';
  const title = recipe.title || 'Untitled';
  const prepTime = recipe.prepTime || 0;
  const cookTime = recipe.cookTime || 0;
  const readyInMinutes = recipe.readyInMinutes || 0;
  const totalTime = readyInMinutes || (prepTime + cookTime);
  const servings = recipe.servings || 0;
  const difficulty = recipe.difficulty || '—';
  const image = recipe.image?.url || recipe.image;
  const badges = userRecipe ? (recipe.tags || []) : (recipe.diets || []);
  const ingredients = recipe.extendedIngredients || recipe.ingredients || [];

  const instructions = recipe.analyzedInstructions?.[0]?.steps
    || (Array.isArray(recipe.instructions)
      ? recipe.instructions.map((step, idx) => ({
          number: idx + 1,
          step: step.text || step,
        }))
      : []);

  const handleDownload = async (type) => {
    setExporting(true);
    setShowExportDialog(false);
    try {
      if (type === 'jpg') {
        await downloadImage(title);
      } else {
        await downloadPDF(title);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        size="lg"
        centered
        backdrop={showExportDialog ? false : 'static'}
        className="recipe-modal"
        style={{
          zIndex: showExportDialog ? 1050 : 1055,
          pointerEvents: showExportDialog ? 'none' : 'auto',
        }}
      >
        <Modal.Header className="border-0 position-relative">
          <Modal.Title>{title}</Modal.Title>

          <div className="position-absolute end-0 top-0 d-flex align-items-center">
            <Button
              variant="link"
              onClick={onSaveToFavorites}
              className={`favorite-btn ${isFavorite ? 'text-danger' : 'text-secondary'}`}
            >
              {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </Button>

            <Button
              variant="link"
              onClick={() => setShowExportDialog(true)}
              className="ms-2"
              disabled={exporting}
            >
              {exporting ? (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <FaDownload size={20} className="text-primary" />
              )}
            </Button>

            <Button variant="link" onClick={onClose} className="close-button ms-2">
              <FaTimes size={24} />
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body className="p-4">
          {image && (
            <div className="recipe-modal-image mb-4 rounded-3 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="img-fluid w-100"
                style={{ height: '300px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="recipe-modal-info">
            <div className="recipe-time-info mb-4 p-3 bg-light rounded-3">
              <p className="mb-1">
                <strong>{userRecipe ? 'Prep Time:' : 'Ready in:'}</strong> {totalTime} mins
              </p>

              {userRecipe ? (
                <p className="mb-1">
                  <strong>Cook Time:</strong> {cookTime} mins <br />
                  <strong>Difficulty:</strong> {difficulty}
                </p>
              ) : (
                <p className="mb-1">
                  <strong>Servings:</strong> {servings}
                </p>
              )}

              {badges.length > 0 && (
                <div className="recipe-tags mt-2">
                  {badges.map((b, i) => (
                    <span key={i} className="recipe-tag badge bg-secondary me-1">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="recipe-modal-content row g-4">
              <div className="recipe-ingredients col-md-6">
                <h3 className="h4 mb-3">Ingredients</h3>
                <ul className="list-unstyled">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="mb-2">
                      • {ingredient.original || `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="recipe-instructions col-md-6">
                <h3 className="h4 mb-3">Instructions</h3>
                {instructions.length > 0 ? (
                  <ol className="ps-3">
                    {instructions.map((step) => (
                      <li key={step.number} className="mb-2">
                        {step.step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No instructions provided.</p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {showExportDialog && (
        <ExportDialog
          onClose={() => setShowExportDialog(false)}
          onDownload={handleDownload}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <RecipeExportTemplate recipe={recipe} exportRef={exportRef} />
      </div>
    </>
  );
}
