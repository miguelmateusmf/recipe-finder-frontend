import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useRef } from "react";
import { RemoveButton } from "../../components/RemoveButton";
import { useTranslations } from "../../context/useTranslations";
import { translateIngredientName } from "./translateIngredient";
import { useLanguage } from "../../context/useLanguage";

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

function CurrentTable({
  itemsList,
  onAddIngredient,
  currIngredients,
}: IngredientTableProps) {
  const t = useTranslations();
  const parentRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const displayedItems = itemsList.filter((item) =>
    currIngredients.has(item.id),
  );

  const virtualizer = useVirtualizer({
    count: displayedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
    getItemKey: (index) => displayedItems[index].id,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      {displayedItems.length === 0 ? (
        <div className="h-full flex items-center justify-center  text-gray-500">
          {t.search.noIngredientsAdded}
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
                className="flex items-center justify-between absolute w-full hover:bg-black/5"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="p-1">
                  {translateIngredientName(item.name, language)}
                </div>
                <div className="p-2">
                  <RemoveButton onClick={() => onAddIngredient(item.id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(CurrentTable);
