import Box from "@material-ui/core/Box";
import getConfig from "next/config";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export async function getServerSideProps() {
  return {
    props: {
      HOTJAR: serverRuntimeConfig.hotjarProd || "",
      APP_ENV: serverRuntimeConfig.appEnv || "",
      API_BASE_URL: serverRuntimeConfig.api.baseUrl || "",
    },
  };
}

type Props = {
  HOTJAR: string;
  APP_ENV: string;
  API_BASE_URL: string;
};

function Env({ HOTJAR, APP_ENV, API_BASE_URL }: Props) {
  return (
    <Box display="flex" flex={1} justifyContent="center" flexDirection="column" alignItems="center">
      <table className="envPage">
        <thead>
          <tr>
            <th colSpan={2}>Backend</th>
          </tr>
          <tr>
            <th>Variável</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HOTJAR_PROD</td>
            <td>{HOTJAR}</td>
          </tr>
          <tr>
            <td>APP_ENV</td>
            <td>{APP_ENV}</td>
          </tr>
          <tr>
            <td>API_BASE_URL</td>
            <td>{API_BASE_URL}</td>
          </tr>
        </tbody>
      </table>
      <table className="envPage">
        <thead>
          <tr>
            <th colSpan={2}>Frontend</th>
          </tr>
          <tr>
            <th>Variável</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>API_BASE_URL</td>
            <td>{publicRuntimeConfig.api.baseUrl}</td>
          </tr>
          <tr>
            <td>NEXTCLOUD_TALK_VERSION</td>
            <td>{publicRuntimeConfig.NCTalkVersion}</td>
          </tr>
        </tbody>
      </table>
    </Box>
  );
}

export default Env;
