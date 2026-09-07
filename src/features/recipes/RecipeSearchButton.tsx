import Button from "../../components/Button";
import { useTranslations } from "../../context/useTranslations";
import { useRecipeSearch, type RecipeDetail } from "./useRecipeSearch";

type RecipeSearchButtonProps = Readonly<{
  selectedNames: string[];
  onResults: (recipes: RecipeDetail[]) => void;
}>;

export function RecipeSearchButton({
  selectedNames,
  onResults,
}: RecipeSearchButtonProps) {
  const t = useTranslations();
  const recipeSearch = useRecipeSearch();

  const handleSearch = () => {
    if (selectedNames.length === 0) return;
    recipeSearch.mutate(selectedNames, {
      onSuccess: (recipes) => onResults(recipes),
    });
  };

  return (
    <Button
      onClick={handleSearch}
      disabled={recipeSearch.isPending || selectedNames.length === 0}
    >
      {recipeSearch.isPending ? t.search.searching : t.search.searchRecipes}
    </Button>
  );
}
