'use client';
import { FaClock, FaUtensils, FaLeaf, FaChevronRight } from 'react-icons/fa';
import '../styles/recipeExport.css';

const RecipeExportTemplate = ({ recipe, exportRef }) => {
  if (!recipe) return null;

  const userRecipe = recipe.source === 'user';

  const title = recipe.title;
  const prepTime = recipe.prepTime || 0;
  const cookTime = recipe.cookTime || 0;
  const readyInMinutes = recipe.readyInMinutes || 0;
  const totalTime = readyInMinutes || (prepTime + cookTime);
  const servings = recipe.servings || 0;

  const ingredients = recipe.extendedIngredients || recipe.ingredients || [];
  const instructions = recipe.analyzedInstructions?.[0]?.steps ||
    (Array.isArray(recipe.instructions) ? recipe.instructions.map((step, idx) => ({
      number: idx + 1,
      step: step.text || step
    })) : []);

     const badges = userRecipe ? recipe.tags || [] : recipe.diets  || [];

  return (
    <div className="recipe-export-template" ref={exportRef}>
      {/* Header */}
      <div className="export-header">
        <div className="header-decoration"></div>
        <h1>{title}</h1>
        <div className="header-decoration"></div>
      </div>

      {/* Content */}
      <div className="export-content">
          <div className="metadata">
            {totalTime > 0 && (
              <div className="meta-item">
                <FaClock /> <span>{totalTime} mins</span>
              </div>
            )}
            {servings > 0 && (
              <div className="meta-item">
                <FaUtensils /> <span>{servings} servings</span>
              </div>
            )}
            {badges.length > 0 && (
              <div className="recipe-tags meta-item mt-2">
                <FaLeaf className="me-1 text-secondary" />
                {badges.map((b, i) => (
                  <span key={i} className="recipe-tag badge bg-secondary me-1"> {b} </span>
                ))}
              </div>
            )}
          </div>

        {/* Ingredients */}
        <div className="section">
          <h2 className="section-title">Ingredients</h2>
          <ul className="ingredient-list">
            {ingredients.map((ing, i) => (
              <li key={i} className="ingredient-item">
                <FaChevronRight className="ingredient-bullet" />
                <span className="ingredient-text">{ing.original || `${ing.amount} ${ing.unit} ${ing.name}`}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="section">
          <h2 className="section-title">Instructions</h2>
          <ol className="instruction-list">
            {instructions.length > 0 ? instructions.map((step) => (
              <li key={step.number} className="instruction-item">
                <span className="step-number">{step.number}.</span>
                <p>{step.step}</p>
              </li>
            )) : (
              <p>No instructions provided.</p>
            )}
          </ol>
        </div>
      </div>

      <div className="export-footer">
        <p>Generated with ❤️ by Baking Assistant</p>
      </div>
    </div>
  );
};

export default RecipeExportTemplate;
