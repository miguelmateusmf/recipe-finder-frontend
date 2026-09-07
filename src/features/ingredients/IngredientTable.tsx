import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useRef } from "react";
import { HeartButton } from "../../components/HeartButton";
import { PlusButton } from "../../components/PlusButton";
import { useLanguage } from "../../context/useLanguage";
import { translateIngredientName } from "./translateIngredient";
import { useTranslations } from "../../context/useTranslations";

type Ingredient = {
  name: string;
  id: number;
};

type IngredientTableProps = Readonly<{
  itemsList: Ingredient[];
  mode?: "all" | "favorites";
  favorites: Set<number>;
  currIngredients: Set<number>;
  onToggleFavorite: (id: number) => void;
  onAddIngredient: (id: number) => void;
}>;

function IngredientTable({
  itemsList,
  mode = "all",
  onToggleFavorite,
  favorites,
  onAddIngredient,
  currIngredients,
}: IngredientTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = useTranslations();

  const displayedItems =
    mode === "favorites"
      ? itemsList.filter((item) => favorites.has(item.id))
      : itemsList;

  const virtualizer = useVirtualizer({
    count: displayedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 25,
    getItemKey: (index) => displayedItems[index].id,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      {displayedItems.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">
          {mode === "favorites"
            ? t.search.noFavYet
            : t.search.noIngredientFound}
        </div>
      ) : (
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = displayedItems[virtualRow.index];
            if (!item) return null;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-16 absolute w-full hover:bg-black/5"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="p-1">
                  {translateIngredientName(item.name, language)}
                </div>
                <div className="flex items-center gap-4 p-2">
                  <PlusButton
                    active={currIngredients.has(item.id)}
                    onClick={() => onAddIngredient(item.id)}
                    ariaLabel={`add ${item.name} to cart`}
                  />
                  <HeartButton
                    active={favorites.has(item.id)}
                    onClick={() => onToggleFavorite(item.id)}
                    ariaLabel={`favorite ${item.name}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(IngredientTable);
