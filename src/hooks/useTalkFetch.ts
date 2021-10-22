import talk from "@/services/talk";
import useSWR from "swr";

// eslint-disable-next-line @typescript-eslint/ban-types
const useTalkFetch = (version: string) => (uri: string, params?: {}, options?: {}) => {
  const { data, error, mutate } = useSWR(
    uri,
    async (uri) => {
      const response = await talk(version).get(uri, { ...params });

      return response.data;
    },
    {
      ...options,
    },
  );

  return { data, error, mutate };
};

export default useTalkFetch;
