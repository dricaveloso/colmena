import ocs from "@/services/core";
import useSWR from "swr";

// eslint-disable-next-line @typescript-eslint/ban-types
const useCoreFetch = (uri: string, params?: {}, options?: {}) => {
  const { data, error, mutate } = useSWR(
    uri,
    async (uri) => {
      const response = await ocs().get(uri, { ...params });

      return response.data;
    },
    {
      ...options,
    },
  );

  return { data, error, mutate };
};

export default useCoreFetch;
