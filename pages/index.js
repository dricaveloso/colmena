import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useRouter } from "next/router";

export default function Home() {
  const divider = (value = 40) => <div style={{ marginTop: value }} />;

  const router = useRouter();

  const navigate = () => {
    console.log("teste");
    router.push("/intro");
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <Box my={4} style={{ textAlign: "center", padding: 10 }}>
        <MailOutlineIcon style={{ fontSize: "100px" }} />
        {divider()}
        <Typography variant="h5" component="h4" gutterBottom>
          Hola
        </Typography>
        {divider(10)}
        <Typography component="p" gutterBottom>
          LA DWA te invita a hacer parte de la sala de redación de radios
          comunitarias
        </Typography>
        {divider()}
        <Button
          variant="contained"
          color="primary"
          naked={true}
          onClick={navigate}
        >
          Aceptar invitación
        </Button>
      </Box>
    </Container>
  );
}
