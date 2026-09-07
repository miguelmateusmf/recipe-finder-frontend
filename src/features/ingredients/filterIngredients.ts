import { translateIngredientName } from "./translateIngredient";
import type { Ingredient } from "./useIngredients";

export function filterIngredients(
  ingredients: Ingredient[],
  search: string,
  foodType: string,
  language: string,
): Ingredient[] {
  return ingredients.filter((ing) => {
    const matchesSearch =
      ing.name.toLowerCase().includes(search.toLowerCase()) ||
      translateIngredientName(ing.name, language)
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesType = foodType === "" || ing.foodType === foodType;
    return matchesSearch && matchesType;
  });
}
