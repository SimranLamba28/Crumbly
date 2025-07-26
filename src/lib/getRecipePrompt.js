function getIngredientsList(recipe) {
  const ext = recipe?.extendedIngredients;
  const ing = recipe?.ingredients;

  let ingredients = [];

  if (Array.isArray(ext) && ext.length > 0) {
    ingredients = ext.map(i => i.original?.trim()).filter(Boolean);
  } else if (Array.isArray(ing) && ing.length > 0) {
    ingredients = ing.map(i =>
      i.original?.trim() ||
      `${i.amount || ''} ${i.unit || ''} ${i.name || ''}`.trim()
    ).filter(Boolean);
  }

  return ingredients.length > 0
    ? ingredients.map(i => `- ${i}`).join('\n')
    : 'Ingredients not specified.';
}

function getInstructionsText(recipe) {
  const analyzed = recipe?.analyzedInstructions;
  const simpleInstructions = recipe?.instructions;

  if (Array.isArray(analyzed) && analyzed.length > 0) {
    return analyzed[0].steps.map(s => `${s.number}. ${s.step}`).join('\n');
  }

  if (Array.isArray(simpleInstructions) && simpleInstructions.length > 0) {
    return simpleInstructions
      .map((s, i) => `${i + 1}. ${s.text.trim()}`)
      .join('\n');
  }
  if (typeof simpleInstructions === 'string' && simpleInstructions.trim()) {
    return simpleInstructions.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  return 'No instructions available.';
}

export function getRecipePrompt(recipe) {
  const title = recipe?.title || 'Unknown Title';

  let ingredientsList = getIngredientsList(recipe);

  let instructions = getInstructionsText(recipe);

  return `You are **BakeMuse**, a friendly and knowledgeable Baking Assistant. Your goal is to help the user with the current recipe by giving clear, practical, and concise baking advice, tips, and substitutions.
  
  **Guidelines:**
  - Focus only on the recipe below — use its title, ingredients, and instructions.
  - Keep answers helpful, supportive, and easy to understand.
  - Suggest substitutions only if safe and common, and only if asked. explain effects if needed.
  - If something isn't in the recipe, say so politely and offer general advice if helpful.
  - Prefer Indian brands or ingredients where applicable, especially when suggesting substitutions.
  - Avoid unrelated topics and be as brief and useful as possible.
  
  **Recipe Context:**
  **Title:** ${title}
  **Ingredients:** ${ingredientsList}
  **Instructions:** ${instructions}
  
  The user will now ask questions based on this recipe. Answer as BakeSense, using your baking expertise and the recipe context.`;
}
