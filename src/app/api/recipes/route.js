import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import mongoose from 'mongoose';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(request) {
  await connect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (userId) {
      // Get all recipes by a specific user
      const recipes = await Recipe.find({ creator: userId });
      return NextResponse.json({ recipes });
    }

    if (id) {
      // Get a single recipe by ID
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ recipe });
    }

    return NextResponse.json(
      { error: 'Either id or userId must be provided' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connect();
  try {
    const recipeData = await request.json();
    
    // Debug log remove
    console.log('Received recipe data:', recipeData);

    // Validate required fields
    if (!recipeData.creator) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }
    
    if (recipeData.image && !recipeData.image.public_id) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const recipe = new Recipe({
      ...recipeData,
      creator: new mongoose.Types.ObjectId(recipeData.creator),
      // Preserve full image object (no transformation needed)
      image: recipeData.image || null
    });

    await recipe.save();

    // Debug log remove
    console.log('Saved recipe:', recipe);
    
    return NextResponse.json(
      { message: 'Recipe saved successfully', 
        recipe: {
          ...recipe.toObject(),
          _id: recipe._id.toString() // Convert ObjectId to string
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save recipe', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connect();
  try {
    const { id } = await request.json();

    // Step 1: Find the recipe first
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Step 2: Delete image from Cloudinary (if exists)
    if (recipe.image?.public_id) {
      console.log('🗑️ Starting image deletion for:', recipe.image.public_id);
      try {
        const result= await deleteImage(recipe.image.public_id);
        if (result.result !== 'ok') {
          console.warn('⚠️ Deletion may have failed:', result);
          // Continue with DB deletion anyway
        }
      } catch (err) {
        console.error('Non-blocking deletion error:', err.message);
      }
    }

    // Step 3: Delete the recipe from DB
    await Recipe.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Recipe and associated image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('💥 Fatal deletion error:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete recipe', details: error.message },
      { status: 500 }
    );
  }
}

