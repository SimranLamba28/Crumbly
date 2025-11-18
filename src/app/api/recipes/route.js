import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import mongoose from "mongoose";
import { deleteImage } from "@/lib/cloudinary";
import { validateRecipeFields } from '@/lib/validateRecipe';
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function GET(request) {
  await connect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id && !userId) {
      return NextResponse.json(
        { error: "Provide a recipe ID or user ID" },
        { status: 400 }
      );
    }

    if (userId) {
      const recipes = await Recipe.find({ creator: userId });
      return NextResponse.json({ recipes });
    }

    if (id) {
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
      }
      return NextResponse.json({ recipe });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching recipes", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recipeData = await request.json();

    const errors = validateRecipeFields(recipeData);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors[0] },
        { status: 400 }
      );
    }

    const recipe = new Recipe({
      ...recipeData,
      creator: new mongoose.Types.ObjectId(session.user.id),
      image: recipeData.image || null,
    });

    await recipe.save();

    return NextResponse.json(
      {
        message: "Recipe saved successfully",
        recipe: {
          ...recipe.toObject(),
          _id: recipe._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save recipe", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (recipe.image?.public_id) {
      try {
        await deleteImage(recipe.image.public_id);
      } catch (err) {
        console.warn("Image deletion failed:", err.message);
      }
    }

    await Recipe.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete recipe", details: error.message },
      { status: 500 }
    );
  }
}
