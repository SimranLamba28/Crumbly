import { NextResponse } from 'next/server';
import { getRecipePrompt } from '@/lib/getRecipePrompt';

export async function POST(req) {
  const { messages, recipe } = await req.json();

  try {
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe data is required for this AI assistant.' },
        { status: 400 }
      );
    }

    const systemPrompt = getRecipePrompt(recipe);
    const fullMessages = messages.length === 1
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Crumbly AI Assistant',
      },
      body: JSON.stringify({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: fullMessages,
        stream: true,
        temperature: 0.7,
        top_p: 1,
        presence_penalty: 0.5,
        frequency_penalty: 0.6,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('OpenRouter error:', aiRes.status, errText);
      return NextResponse.json(
        { error: 'AI server error:', errText},
        { status: 502 }
      );
    }

    const stream = aiRes.body;

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json(
      { error: 'Internal server error:' + error.message }, 
      { status: 500 }
    );
  }
}