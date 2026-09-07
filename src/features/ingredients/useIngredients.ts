import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export type Ingredient = {
  id: number;
  name: string;
  foodType: string;
};

export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: () =>
      api.get<Ingredient[]>("/api/ingredients").then((r) => r.data),
    staleTime: Infinity,
  });
}
