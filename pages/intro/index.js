import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

export default function Intro() {
  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <Box
        my={4}
        style={{
          textAlign: "center",
          padding: 10,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography component="p" gutterBottom>
          Logo
        </Typography>
        <Box>
          <Typography
            variant="h5"
            component="h4"
            style={{ marginBottom: 40 }}
            gutterBottom
          >
            Hola
          </Typography>
          <Button variant="contained" color="primary" naked>
            Prosseguir
          </Button>
        </Box>
        <Box style={{ display: "flex", flexDirection: "column" }}>
          <Button
            size="small"
            variant="text"
            style={{ textTransform: "capitalize", color: "gray" }}
          >
            Sobre MAIA
          </Button>
          <Button
            size="small"
            style={{ textTransform: "capitalize", color: "gray" }}
          >
            Termos de uso
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
