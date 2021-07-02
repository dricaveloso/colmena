import api from "services/api";
import useSWR from "swr";

// eslint-disable-next-line @typescript-eslint/ban-types
const useFetch = (uri: string, params?: {}, options?: {}) => {
  const { data, error, mutate } = useSWR(
    uri,
    async (uri) => {
      const response = await api().get(uri, { ...params });

      return response.data;
    },
    {
      ...options,
    },
  );

  return { data, error, mutate };
};

export default useFetch;
