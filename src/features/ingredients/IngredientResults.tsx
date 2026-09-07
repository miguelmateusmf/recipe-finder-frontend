import { memo, useMemo, useState } from "react";
import IngredientTable from "./IngredientTable";
import type { Ingredient } from "./useIngredients";
import { filterIngredients } from "./filterIngredients";
import { useTranslations } from "../../context/useTranslations";
import { useMediaQuery } from "@mui/material";
import { useLanguage } from "../../context/useLanguage";

type IngredientResultsProps = Readonly<{
  ingredients: Ingredient[];
  search: string;
  foodType: string;
  favorites: Set<number>;
  currIngredients: Set<number>;
  onToggleFavorite: (id: number) => void;
  onAddIngredient: (id: number) => void;
}>;

export function IngredientResults(props: IngredientResultsProps) {
  const isMobile = useMediaQuery("(max-width:1024px)");
  return isMobile ? (
    <MobileResults {...props} />
  ) : (
    <DesktopResults {...props} />
  );
}

function DesktopResults({
  ingredients,
  search,
  foodType,
  favorites,
  currIngredients,
  onToggleFavorite,
  onAddIngredient,
}: IngredientResultsProps) {
  const t = useTranslations();
  const { language } = useLanguage();
  const filtered = useMemo(
    () => filterIngredients(ingredients, search, foodType, language),
    [ingredients, search, foodType, language],
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-16 justify-center min-h-0 flex-1">
      <div className="flex flex-col min-h-0 flex-1 lg:max-w-xl">
        <h3 className="text-center mb-2 font-semibold">
          {t.search.allIngredients}
        </h3>
        <div className="flex-1 min-h-0 border rounded">
          <IngredientTable
            itemsList={filtered}
            favorites={favorites}
            currIngredients={currIngredients}
            mode="all"
            onToggleFavorite={onToggleFavorite}
            onAddIngredient={onAddIngredient}
          />
        </div>
      </div>
      <div className="flex flex-col min-h-0 flex-1 lg:max-w-xl">
        <h3 className="text-center mb-2 font-semibold">
          {t.search.favIngredients}
        </h3>
        <div className="flex-1 min-h-0 border rounded">
          <IngredientTable
            itemsList={filtered}
            favorites={favorites}
            currIngredients={currIngredients}
            mode="favorites"
            onToggleFavorite={onToggleFavorite}
            onAddIngredient={onAddIngredient}
          />
        </div>
      </div>
    </div>
  );
}

function MobileResults({
  ingredients,
  search,
  foodType,
  favorites,
  currIngredients,
  onToggleFavorite,
  onAddIngredient,
}: IngredientResultsProps) {
  const t = useTranslations();
  const [view, setView] = useState<"all" | "favorites">("all");
  const { language } = useLanguage();

  const filtered = useMemo(
    () => filterIngredients(ingredients, search, foodType, language),
    [ingredients, search, foodType, language],
  );

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex mb-2">
        <button
          onClick={() => setView("all")}
          className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
            view === "all"
              ? "border-current text-inherit"
              : "border-transparent text-gray-400"
          }`}
        >
          {t.search.allIngredients}
        </button>
        <button
          onClick={() => setView("favorites")}
          className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
            view === "favorites"
              ? "border-current text-inherit"
              : "border-transparent text-gray-400"
          }`}
        >
          {t.search.favIngredients}
        </button>
      </div>
      <div className="flex-1 min-h-0 border rounded">
        <IngredientTable
          itemsList={filtered}
          favorites={favorites}
          currIngredients={currIngredients}
          mode={view}
          onToggleFavorite={onToggleFavorite}
          onAddIngredient={onAddIngredient}
        />
      </div>
    </div>
  );
}

export default memo(IngredientResults);
