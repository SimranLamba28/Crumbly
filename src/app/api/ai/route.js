// ai/route.js
import { NextResponse } from 'next/server';
import { getRecipePrompt } from '@/lib/getRecipePrompt';

export async function POST(req) {
  const { messages, recipe } = await req.json();

  try {
    if (!recipe) {
      console.error('API Error: Recipe object is missing from the request body.');
      return NextResponse.json({ error: 'Recipe data is required for this AI assistant.' }, { status: 400 });
    }
    
    const recipeSystemPrompt = getRecipePrompt(recipe);

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: recipeSystemPrompt},
          ...messages.filter(m => m.role !== 'system'),
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('OpenRouter error:', res.status, errBody);
      return NextResponse.json({ error: 'AI server error' }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      console.warn('OpenRouter returned empty', data);
      return NextResponse.json({ reply: 'Hmm, I got nothing back — try again.' });
    }

    return NextResponse.json({ reply });

  } catch (e) {
    console.error('API exception', e);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
