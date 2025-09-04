export function getIngredientsListText(recipe) {
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

export function getInstructionsText(recipe) {
  const analyzed = recipe?.analyzedInstructions;
  const simpleInstructions = recipe?.instructions;

  if (Array.isArray(analyzed) && analyzed.length > 0) {
    return analyzed[0].steps.map(s => `${s.number}. ${s.step}`).join('\n');
  }

  if (Array.isArray(simpleInstructions) && simpleInstructions.length > 0) {
    return simpleInstructions
      .map((s, i) => `${i + 1}. ${s.text?.trim() || s.trim()}`) 
      .join('\n');
  }
  if (typeof simpleInstructions === 'string' && simpleInstructions.trim()) {
    return simpleInstructions.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  return 'No instructions available.';
}
