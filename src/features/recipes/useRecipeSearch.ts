import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type RecipeMatch = {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
};

export type RecipeDetail = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  extendedIngredients: {
    id: number;
    original: string;
  }[];
  analyzedInstructions: {
    steps: {
      number: number;
      step: string;
    }[];
  }[];
};

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

export function useRecipeSearch() {
  return useMutation({
    mutationFn: async (ingredients: string[]): Promise<RecipeDetail[]> => {
      // Step 1: find recipe IDs by ingredients
      const { data: matches } = await axios.get<RecipeMatch[]>(
        `${BASE_URL}/recipes/findByIngredients`,
        {
          params: {
            ingredients: ingredients.join(","),
            number: 12,
            ranking: 1,
            ignorePantry: true,
            apiKey: API_KEY,
          },
        },
      );

      if (matches.length === 0) return [];

      const ids = matches.map((m) => m.id).join(",");
      const { data: details } = await axios.get<RecipeDetail[]>(
        `${BASE_URL}/recipes/informationBulk`,
        {
          params: { ids, apiKey: API_KEY },
        },
      );

      return details;
    },
  });
}
