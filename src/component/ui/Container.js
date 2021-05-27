import Container from "@material-ui/core/Container";

export default function Ctnr({
  justifyContent = "center",
  maxWidth = "sm",
  extraStyle = {},
  children,
}) {
  return (
    <Container
      maxWidth={maxWidth}
      style={{
        display: "flex",
        flex: 1,
        justifyContent,
        height: "100vh",
        backgroundColor: "white",
        ...extraStyle,
      }}
    >
      {children}
    </Container>
  );
}
