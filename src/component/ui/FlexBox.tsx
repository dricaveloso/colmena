import Box from "@material-ui/core/Container";

export default function Bx({
  textAlign = "center",
  padding = 10,
  flexDirection = "column",
  alignItems = "center",
  justifyContent = "space-between",
  extraStyle = {},
  children,
}) {
  return (
    <Box
      my={4}
      style={{
        textAlign,
        padding,
        display: "flex",
        flex: 1,
        flexDirection,
        justifyContent,
        alignItems,
        marginBottom: 10,
        ...extraStyle,
      }}
    >
      {children}
    </Box>
  );
}
