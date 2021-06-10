import api from "services/api";
import useSWR from "swr";

const useFetch = (uri, params, { ...options }) => {
  const { data, error, mutate } = useSWR(
    uri,
    async (uri) => {
      const response = await api().get(uri, { ...params });

      return response.data;
    },
    {
      ...options,
    }
  );

  return { data, error, mutate };
};

export default useFetch;
