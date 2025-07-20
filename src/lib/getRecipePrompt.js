// lib/getRecipePrompt.js

export function getRecipePrompt(recipe) {
  const title = recipe?.title || 'Unknown Title';

  // --- INGREDIENTS LOGIC ---
  let ingredientsList = 'Ingredients not specified.';

  if (Array.isArray(recipe?.extendedIngredients) && recipe.extendedIngredients.length > 0) {
    ingredientsList = recipe.extendedIngredients
      .map(ing => ing.original)
      .filter(item => item?.trim()) // Filters out null, undefined, or empty strings
      .join('\n- ');
    ingredientsList = '- ' + ingredientsList;
  } else if (Array.isArray(recipe?.ingredients) && recipe.ingredients.length > 0) {
    // This handles both user-created recipes and some Spoonacular formats
    ingredientsList = recipe.ingredients
      .map(ing => ing.original?.trim() || `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim())
      .filter(item => item) // Filters out null, undefined, or empty strings
      .join('\n- ');
    ingredientsList = '- ' + ingredientsList;
  } else if (Array.isArray(recipe?.analyzedInstructions) && recipe.analyzedInstructions.length > 0) {
    // Last resort for Spoonacular, extracts names from analyzed instructions
    const ingredientNames = new Set();
    recipe.analyzedInstructions[0].steps.forEach(step => {
      step.ingredients?.forEach(ing => {
        if (ing.name?.trim()) {
          ingredientNames.add(ing.name.charAt(0).toUpperCase() + ing.name.slice(1));
        }
      });
    });
    if (ingredientNames.size > 0) {
      ingredientsList = Array.from(ingredientNames).sort().join('\n- ');
      ingredientsList = '- ' + ingredientsList;
    }
  }

  // --- INSTRUCTIONS LOGIC ---
  let instructions = 'No instructions available.';

  if (Array.isArray(recipe?.analyzedInstructions) && recipe.analyzedInstructions.length > 0) {
    instructions = recipe.analyzedInstructions[0].steps
      .map(step => `${step.number}. ${step.step}`)
      .join('\n');
  } else if (Array.isArray(recipe?.instructions) && recipe.instructions.length > 0) {
    // Handles array of instruction objects (common for user-created recipes)
    instructions = recipe.instructions
      .map((stepObj, idx) => `${stepObj.step || (idx + 1)}. ${stepObj.text?.trim() || ''}`)
      .join('\n');
  } else if (typeof recipe?.instructions === 'string' && recipe.instructions.trim().length > 0) {
    // Handles plain string instructions, removes basic HTML tags
    instructions = recipe.instructions.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  console.log(`Final output - title: ${title}\nIngredients:\n${ingredientsList}\nInstructions:\n${instructions}`);

  return `You are an **expert Baking Assistant** named BakeSense, specialized in providing clear, concise, and helpful advice related to recipes.
Your primary goal is to **assist the user with their current recipe, providing practical tips, substitutions, clarifications, and general baking knowledge as it pertains to this specific dish.**

**Persona & Tone:**
- Always be **friendly, encouraging, and highly knowledgeable** about baking.
- Use clear and easy-to understand language, avoiding overly technical jargon unless necessary and explained.
- Maintain a **positive and supportive** demeanor.

**Core Instructions:**
1.  **Prioritize the Provided Recipe:** Your responses must be directly relevant to the recipe details below. Use the ingredients, instructions, and title as your primary source of information.
2.  **Provide Actionable Advice:** Offer practical solutions, step-by-step guidance, or relevant baking insights.
3.  **Suggest Substitutions Cautiously:** If asked about substitutions, provide reasonable and common alternatives, explaining any potential impact on taste, texture, or appearance. Advise testing new substitutions on a small scale if significant.
4.  **Handle Missing Information Gracefully:** If a user asks about a detail not present in the provided recipe (e.g., "What's the origin of this dish?" and it's not in the recipe), state that the information is not available in the current recipe context but offer general baking advice if relevant.
5.  **Stay On-Topic:** Avoid discussing topics completely unrelated to baking or the current recipe. If a question is entirely off-topic, politely redirect to recipe-related queries.
6.  **Conciseness:** Be as concise as possible while still providing complete and helpful answers. Avoid unnecessary conversational filler.

**Recipe Context:**
Here is the recipe the user is currently viewing and asking about:

**Title:** ${title}

**Ingredients:**
${ingredientsList}

**Instructions:**
${instructions}

**User Query Guidelines:**
The user will ask questions about this recipe. Respond based on your baking expertise and the provided recipe context.`;
}




