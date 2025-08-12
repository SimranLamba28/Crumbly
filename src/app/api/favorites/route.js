import connect from '@/lib/mongodb';
import Favorite from '@/models/favorite';

export async function GET(request) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const favorites = await Favorite.find({ userId }).populate('recipeId');
    
    return new Response(JSON.stringify({ favorites }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch favorites' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const { userId, recipeId, title, image } = await request.json();
    
    if (!userId || !recipeId) {
      return new Response(JSON.stringify({ error: 'User ID and Recipe ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await connect();

    const existingFavorite = await Favorite.findOne({ userId, recipeId });
    
    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return Response.json({ 
        message: 'Removed from favorites',
        isFavorite: false 
      });
    } else {
      await Favorite.create({
      userId,
      recipeId,
      title,
      image,
      source: 'api' 
    });

    return Response.json(
      { message: 'Added to favorites', isFavorite: true },
      { status: 201 }
    );
  }
  } catch (error) {
    return Response.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    );
  }
}

