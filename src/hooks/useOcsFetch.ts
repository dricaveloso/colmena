import ocs from "@/services/ocs";
import useSWR from "swr";

// eslint-disable-next-line @typescript-eslint/ban-types
const useOcsFetch = (uri: string, params?: {}, options?: {}) => {
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

export default useOcsFetch;
