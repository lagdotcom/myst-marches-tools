import type { PC, Session } from "@common/types";
import { useCallback, useState } from "react";
import useSWR from "swr";

const apiRoot = "/api";
const pcRoot = apiRoot + "/pc";
const sessionRoot = apiRoot + "/session";

export interface ErrorResponse {
  error: string;
}

const fetchPCList = (url: string) => fetch(url).then<PC[]>((res) => res.json());
export const usePCList = () => useSWR(pcRoot, fetchPCList);

const fetchSessionList = (url: string) =>
  fetch(url).then<Session[]>((res) => res.json());
export const useSessionList = () => useSWR(sessionRoot, fetchSessionList);

function useEndpoint<T>(url: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (method: string, data: T) => {
      setIsSubmitting(true);
      const result = await fetch(url, {
        method,
        body: JSON.stringify(data),
      });
      setIsSubmitting(false);

      if (!result.ok) {
        const data = (await result.json()) as ErrorResponse;
        return data.error;
      }
    },
    [setIsSubmitting, url],
  );

  const post = useCallback((data: T) => submit("POST", data), [submit]);
  const put = useCallback((data: T) => submit("PUT", data), [submit]);

  return { isSubmitting, post, put };
}

export const usePCAPI = () => useEndpoint<PC>(pcRoot);
export const useSessionAPI = () => useEndpoint<Session>(sessionRoot);
