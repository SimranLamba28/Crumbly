// utils/validateRecipe.js

export function validateRecipeFields(recipe) {
  const errors = [];

  const isEmpty = (val) => !val || !String(val).trim();

  if (isEmpty(recipe.title)) errors.push("Title is required.");

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.push("At least one ingredient is required.");
  } else {
    recipe.ingredients.forEach((ing, i) => {
      if (isEmpty(ing.name)) {
        errors.push(`Ingredient ${i + 1}: Name is required.`);
      }
    });
  }

  if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    errors.push("At least one instruction step is required.");
  } else {
    recipe.instructions.forEach((step, i) => {
      if (isEmpty(step)) errors.push(`Instruction ${i + 1} cannot be empty.`);
    });
  }
  
  if (Array.isArray(recipe.tags)) {
    const nonEmptyTags = recipe.tags.filter(tag => String(tag).trim() !== "");
    
    if (nonEmptyTags.length > 0) {
        recipe.tags.forEach((tag, i) => {
            if (!String(tag).trim()) {
                errors.push(`Tag ${i + 1} cannot be empty.`);
            }
        });
    }
  }

  if (!recipe.prepTime || recipe.prepTime < 1) errors.push("Prep time must be at least 1 minute.");
  if (!recipe.cookTime || recipe.cookTime < 1) errors.push("Cook time must be at least 1 minute.");
  if (!recipe.servings || recipe.servings < 1) errors.push("Servings must be at least 1.");

  return errors;
}
