import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export function useFavoriteIds() {
  return useQuery({
    queryKey: ["favorites", "ids"],
    queryFn: () => api.get<number[]>("/api/favorites/ids").then((r) => r.data),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: number; isFavorite: boolean }) =>
      isFavorite
        ? api.delete(`/api/favorites/${id}`)
        : api.post(`/api/favorites/${id}`),

    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites", "ids"] });
      const previous = queryClient.getQueryData<number[]>(["favorites", "ids"]);

      queryClient.setQueryData<number[]>(["favorites", "ids"], (old = []) =>
        isFavorite ? old.filter((x) => x !== id) : [...old, id],
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["favorites", "ids"], context.previous);
      }
    },

    onSettled: (_data, error) => {
      if (error) {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      }
      // on success, trust the optimistic update — no refetch
    },
  });
}
