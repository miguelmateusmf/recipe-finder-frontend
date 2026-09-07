import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import CurrentTable from "../../features/ingredients/CurrentTable";
import { useIngredients } from "../../features/ingredients/useIngredients";
import {
  useToggleFavorite,
  useFavoriteIds,
} from "../../features/ingredients/useFavorites";
import { MenuItem, Select, TextField } from "@mui/material";
import IngredientResults from "../../features/ingredients/IngredientResults";
import { RecipeSearchButton } from "../../features/recipes/RecipeSearchButton";
import { RecipeResultsModal } from "../../features/recipes/RecipeResultsModal";
import type { RecipeDetail } from "../../features/recipes/useRecipeSearch";
import { useTranslations } from "../../context/useTranslations";

export const Route = createFileRoute("/_authenticated/search")({
  component: RouteComponent,
});

const FOOD_TYPES = [
  "CEREALS",
  "ROOTS",
  "VEGETABLES",
  "MEAT",
  "FRUIT",
  "EGGS",
  "FISH",
  "SEAFOOD",
  "LEGUMES",
  "DAIRY",
  "OILS",
  "SUGAR",
  "MISCELLANEOUS",
];

function RouteComponent() {
  const t = useTranslations();
  const { data: favoriteIds } = useFavoriteIds();
  const favoriteSet = useMemo(() => new Set(favoriteIds ?? []), [favoriteIds]);
  const toggleFavorite = useToggleFavorite();

  const [selecIngredients, setSelecIngredients] = useState<Set<number>>(
    new Set(),
  );
  const { data, isLoading, error } = useIngredients();
  const ingredients = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [foodType, setFoodType] = useState("");

  const [recipes, setRecipes] = useState<RecipeDetail[]>([]);
  const [recipesOpen, setRecipesOpen] = useState(false);

  const selectedNames = useMemo(
    () =>
      ingredients
        .filter((ing) => selecIngredients.has(ing.id))
        .map((ing) => ing.name),
    [ingredients, selecIngredients],
  );

  const handleResults = (result: RecipeDetail[]) => {
    setRecipes(result);
    setRecipesOpen(true);
  };

  const handleToggleFavorite = useCallback(
    (id: number) => {
      toggleFavorite.mutate({ id, isFavorite: favoriteSet.has(id) });
    },
    [toggleFavorite, favoriteSet],
  );

  const toggleIngredient = useCallback((id: number) => {
    setSelecIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0">
      <div className="w-full lg:w-1/6 lg:max-w-64 border-b lg:border-b-0 lg:border-r border-gray-200 p-4 gap-4 flex flex-col min-h-0 max-h-64 lg:max-h-none">
        <h3 className="text-center font-semibold">
          {t.search.currIngredients}
        </h3>
        <div className="flex-1 min-h-32 max-h-3/5 border rounded">
          <CurrentTable
            itemsList={ingredients}
            favorites={favoriteSet}
            currIngredients={selecIngredients}
            mode="all"
            onToggleFavorite={handleToggleFavorite}
            onAddIngredient={toggleIngredient}
          />
        </div>
        <RecipeSearchButton
          selectedNames={selectedNames}
          onResults={handleResults}
        />
      </div>
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:justify-center">
          <TextField
            size="small"
            placeholder={t.search.searchIngredients}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          <Select
            size="small"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            displayEmpty
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">{t.search.allTypes}</MenuItem>
            {FOOD_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {t.foodTypes[type as keyof typeof t.foodTypes]}
              </MenuItem>
            ))}
          </Select>
        </div>
        {isLoading && <div>{t.search.loadingIngredients}</div>}
        {error && <div>{t.search.errorFetch}</div>}
        <IngredientResults
          ingredients={ingredients}
          search={deferredSearch}
          foodType={foodType}
          favorites={favoriteSet}
          currIngredients={selecIngredients}
          onToggleFavorite={handleToggleFavorite}
          onAddIngredient={toggleIngredient}
        />
      </div>
      <RecipeResultsModal
        open={recipesOpen}
        onClose={() => setRecipesOpen(false)}
        recipes={recipes}
      />
    </div>
  );
}
