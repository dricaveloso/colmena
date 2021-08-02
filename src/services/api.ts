import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const api = () => {
  const api = axios.create({
    baseURL: publicRuntimeConfig.api.baseUrl,
    headers: {
      Accept: "application/json",
    },
  });

  // api.interceptors.request.use((config) => {
  //   if (userToken) {
  //     config.headers["Authorization"] = `bearer ${userToken}`;
  //   }

  //   return config;
  // });

  // api.interceptors.response.use((error) => {
  //   switch (error.status) {
  //     case 401:
  //       if (error.config.url != 'logout') {
  //         errorMessage(
  //           'Sua sessão expirou. Você será redirecionado para a tela de login.'
  //         );

  //         store.dispatch(Creators.logout());
  //       }
  //       break;
  //     case 403:
  //       errorMessage('Você não tem permissão para esta ação.');
  //       return Router.back();
  //       break;

  //     default:
  //       return error;
  //       break;
  //   }
  // });

  return api;
};

export default api;
