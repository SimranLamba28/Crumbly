'use client'; 

import { useMemo } from 'react';
import { getIngredientsListText, getInstructionsText } from '@/lib/recipeUtils'; 

export const useRecipeDisplayData = (recipe) => {
  const formattedRecipeData = useMemo(() => {
    if (!recipe) {
      return {
        title: 'Loading...',
        prepTime: 0, cookTime: 0, totalTime: 0, servings: 0, difficulty: '—',
        image: null, badges: [], ingredients: [], instructions: [], userRecipe: false,
        ingredientsListText: 'Ingredients not specified.',
        instructionsText: 'No instructions available.'
      };
    }

    const userRecipe = recipe.source === 'user';
    const title = recipe.title || 'Untitled';
    const prepTime =  recipe.prepTime || 0;
    const cookTime = recipe.cookTime || 0;
    const totalTime = recipe.readyInMinutes ||prepTime + cookTime;
    const servings = recipe.servings || 0;
    const difficulty = recipe.difficulty || '—';
    const image = recipe.image?.url || recipe.image;
    const badges = userRecipe ? (recipe.tags || []).filter(tag => String(tag).trim() !== "") : (recipe.diets || []);


    const ingredients = recipe.extendedIngredients || recipe.ingredients || [];

    let instructions = [];
    if (recipe.analyzedInstructions?.[0]?.steps) {
      instructions = recipe.analyzedInstructions[0].steps;
    } else if (Array.isArray(recipe.instructions)) {
      instructions = recipe.instructions.map((step, idx) => ({
        number: idx + 1,
        step: step.text || step,
      }));
    }

    const ingredientsListText = getIngredientsListText(recipe);
    const instructionsText = getInstructionsText(recipe);

    return {
      title,
      prepTime,
      cookTime,
      totalTime,
      servings,
      difficulty,
      image,
      badges,
      ingredients,
      instructions,
      userRecipe,
      ingredientsListText,
      instructionsText,
    };
  }, [recipe]);

  return formattedRecipeData;
};