import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); 

  const apiKey = process.env.SPOONACULAR_API_KEY;

  try {
    if (type === "search") {
      const query = searchParams.get("query");
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query,
          apiKey,
          number: 50,
          type: "dessert",
          addRecipeInformation: true,
          includeNutrition: false,
          instructionsRequired: true,
        },
      });
      return NextResponse.json(response.data);
    }

    if (type === "details") {
      const id = searchParams.get("id");
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey,
          includeNutrition: false,
        },
      });
      return NextResponse.json(response.data);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Spoonacular API error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch from Spoonacular", details: err.message },
      { status: 500 }
    );
  }
}
