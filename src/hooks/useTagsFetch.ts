import tags from "@/services/tags";
import useSWR from "swr";

// eslint-disable-next-line @typescript-eslint/ban-types
const useTagsFetch = (uri: string, params?: {}, options?: {}) => {
  const { data, error, mutate } = useSWR(
    uri,
    async (uri) => {
      const response = await tags().get(uri, { ...params });

      return response.data;
    },
    {
      ...options,
    },
  );

  return { data, error, mutate };
};

export default useTagsFetch;
