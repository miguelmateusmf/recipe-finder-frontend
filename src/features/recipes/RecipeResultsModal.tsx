import { Modal } from "../../components/Modal";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import type { RecipeDetail } from "./useRecipeSearch";
import { useTranslations } from "../../context/useTranslations";

type RecipeResultsModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  recipes: RecipeDetail[];
}>;

export function RecipeResultsModal({
  open,
  onClose,
  recipes,
}: RecipeResultsModalProps) {
  const t = useTranslations();
  return (
    <Modal open={open} onClose={onClose} title="Recipes" maxWidth="md">
      {recipes.length > 0 ? (
        <div className="flex flex-col gap-2">
          {recipes.map((recipe) => (
            <RecipeAccordion key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          {t.search.noRecipesFound}
        </div>
      )}
    </Modal>
  );
}

function RecipeAccordion({ recipe }: Readonly<{ recipe: RecipeDetail }>) {
  const t = useTranslations();
  const steps = recipe.analyzedInstructions[0]?.steps ?? [];

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography sx={{ fontWeight: 600 }}>{recipe.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-col gap-4">
          <Typography variant="caption" color="text.secondary">
            {recipe.readyInMinutes} min · serves {recipe.servings}
          </Typography>

          <div>
            <Typography variant="subtitle2" gutterBottom>
              {t.search.ingredients}
            </Typography>
            <ul className="list-disc pl-5 text-sm">
              {recipe.extendedIngredients.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
          </div>

          {steps.length > 0 && (
            <div>
              <Typography variant="subtitle2" gutterBottom>
                {t.search.preparation}
              </Typography>
              <ol className="list-decimal pl-5 text-sm flex flex-col gap-1">
                {steps.map((s) => (
                  <li key={s.number}>{s.step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
