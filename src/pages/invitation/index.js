import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";
import Button from "component/ui/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MailOutlineSharpIcon from "@material-ui/icons/MailOutlineSharp";
import { useRouter } from "next/router";
import useTranslation from "hooks/useTranslation";
import Box100 from "component/ui/Box100";

function Invitation(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "invitation");

  return (
    <Container>
      <Box
        my={4}
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 10,
        }}
      >
        <MailOutlineSharpIcon style={{ fontSize: "150px" }} />
        <Divider marginTop={10} />
        <Typography variant="h5" component="h4" gutterBottom>
          {t?.greeting}
        </Typography>
        <Divider marginTop={10} />
        <Box100>
          <Typography component="p" gutterBottom className="width-based-device">
            {t?.description}
          </Typography>
        </Box100>
        <Divider />
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Button
            title={t?.forms?.button1}
            handleClick={() => router.push("/intro/1")}
          />
          <Divider marginTop={15} />
          <Button
            title={t?.forms?.button2}
            handleClick={() => router.push("/intro/1")}
          />
        </Box>
      </Box>
      <FooterApp about={true} terms={false} fixed={true} lang={props.lang} />
    </Container>
  );
}

export default Invitation;
