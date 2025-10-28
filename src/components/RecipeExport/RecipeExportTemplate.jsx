'use client';
import { FaClock, FaUtensils, FaLeaf, FaChevronRight } from 'react-icons/fa';
import '../../styles/recipeExport.css';
import { useRecipeDisplayData } from '@/hooks/useRecipeDisplayData';

const RecipeExportTemplate = ({ recipe, exportRef }) => {
  if (!recipe) return null;

  const {title, totalTime, servings, ingredients, instructions, badges} = useRecipeDisplayData(recipe);

  return (
    <div className="recipe-export-template" ref={exportRef}>
      <div className="export-header">
        <div className="header-decoration"></div>
        <h1>{title}</h1>
        <div className="header-decoration"></div>
      </div>

      <div className="export-content">
          <div className="metadata">
            {totalTime> 0 && (
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

        <div className="section">
          <h2 className="section-title">Ingredients</h2>
          <ul className="ingredient-list">
            {ingredients.map((ing, i) => (
              <li key={i} className="ingredient-item">
                <span className='ingredient-group'>
                  <FaChevronRight className="ingredient-bullet" />
                  <span className="ingredient-text">{ing.original || `${ing.amount} ${ing.unit} ${ing.name}`}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

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
        <p>Generated with ❤️</p>
      </div>
    </div>
  );
};

export default RecipeExportTemplate;
