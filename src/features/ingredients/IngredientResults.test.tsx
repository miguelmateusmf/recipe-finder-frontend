import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IngredientResults } from "./IngredientResults";
import type { Ingredient } from "./useIngredients";
import { LanguageProvider } from "../../context/languageProvider";

vi.mock("./IngredientTable", () => ({
  default: ({ itemsList }: { itemsList: Ingredient[] }) => (
    <ul>
      {itemsList.map((i) => (
        <li key={i.id}>{i.name}</li>
      ))}
    </ul>
  ),
}));

const sample: Ingredient[] = [
  { id: 1, name: "Chicken", foodType: "MEAT" },
  { id: 2, name: "Apple", foodType: "FRUIT" },
  { id: 3, name: "Chickpeas", foodType: "LEGUMES" },
];

const noop = () => {};

function renderResults(search: string, foodType: string) {
  return render(
    <LanguageProvider>
      <IngredientResults
        ingredients={sample}
        search={search}
        foodType={foodType}
        favorites={new Set()}
        currIngredients={new Set()}
        onToggleFavorite={noop}
        onAddIngredient={noop}
      />
    </LanguageProvider>,
  );
}

describe("IngredientResults (integration)", () => {
  it("renders all ingredients when no filter", () => {
    renderResults("", "");
    expect(screen.getAllByText("Chicken").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Apple").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Chickpeas").length).toBeGreaterThan(0);
  });

  it("filters the rendered list by search text", () => {
    renderResults("chick", "");
    expect(screen.getAllByText("Chicken").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Chickpeas").length).toBeGreaterThan(0);
    expect(screen.queryByText("Apple")).toBeNull(); // filtered out
  });

  it("filters the rendered list by food type", () => {
    renderResults("", "FRUIT");
    expect(screen.getAllByText("Apple").length).toBeGreaterThan(0);
    expect(screen.queryByText("Chicken")).toBeNull();
  });
});
