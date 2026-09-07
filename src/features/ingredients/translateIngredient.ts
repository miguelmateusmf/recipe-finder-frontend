import { ingredientNames } from "./ingredientNames";

export function translateIngredientName(
  name: string,
  language: string,
): string {
  if (language === "pt") {
    return ingredientNames[name] ?? name;
  }
  return name;
}
