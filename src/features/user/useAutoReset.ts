import { useEffect } from "react";

export function useAutoReset(
  isSuccess: boolean,
  isError: boolean,
  reset: () => void,
) {
  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(reset, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, reset]);
}
