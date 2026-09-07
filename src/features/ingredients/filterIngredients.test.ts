import { describe, it, expect } from "vitest";
import { filterIngredients } from "./filterIngredients";
import type { Ingredient } from "./useIngredients";

const sample: Ingredient[] = [
  { id: 1, name: "Chicken", foodType: "MEAT" },
  { id: 2, name: "Apple", foodType: "FRUIT" },
  { id: 3, name: "Cheddar", foodType: "DAIRY" },
  { id: 4, name: "Chickpeas", foodType: "LEGUMES" },
];

describe("filterIngredients", () => {
  it("returns all when no filters applied", () => {
    expect(filterIngredients(sample, "", "", "en")).toHaveLength(4);
  });

  it("filters by name, case-insensitive", () => {
    const result = filterIngredients(sample, "chick", "", "en");
    expect(result.map((i) => i.name)).toEqual(["Chicken", "Chickpeas"]);
  });

  it("filters by food type", () => {
    const result = filterIngredients(sample, "", "FRUIT", "en");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Apple");
  });

  it("combines name and type filters", () => {
    expect(filterIngredients(sample, "chick", "MEAT", "en")).toHaveLength(1);
    expect(filterIngredients(sample, "chick", "FRUIT", "en")).toHaveLength(0);
  });

  it("returns empty when nothing matches", () => {
    expect(filterIngredients(sample, "xyz", "", "en")).toHaveLength(0);
  });

  it("matches Portuguese names when language is pt", () => {
    const result = filterIngredients(sample, "grão", "", "pt");
    expect(result.map((i) => i.name)).toEqual(["Chickpeas"]);
  });
});
