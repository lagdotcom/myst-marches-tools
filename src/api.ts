import { useCallback, useState } from "react";
import useSWR from "swr";

import type { PC } from "./types";

const apiRoot = "/api";
const pcRoot = apiRoot + "/pc";

interface ErrorResponse {
  error: string;
}

interface PCListResponse {
  results: PC[];
}
const fetchPCList = (url: string) =>
  fetch(url).then<PCListResponse>((res) => res.json());

export const usePCList = () => useSWR(pcRoot, fetchPCList);

export function useAddPC() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (data: PC) => {
      setIsSubmitting(true);
      const result = await fetch(pcRoot, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setIsSubmitting(false);

      if (!result.ok) {
        const data = (await result.json()) as ErrorResponse;
        return data.error;
      }
    },
    [setIsSubmitting],
  );

  return { isSubmitting, submit };
}

export function useEditPC() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (data: PC) => {
      setIsSubmitting(true);
      const result = await fetch(pcRoot, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setIsSubmitting(false);

      if (!result.ok) {
        const data = (await result.json()) as ErrorResponse;
        return data.error;
      }
    },
    [setIsSubmitting],
  );

  return { isSubmitting, submit };
}
