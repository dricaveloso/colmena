function Box100({ flexDirection = "column", children }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        flexDirection,
      }}
    >
      {children}
    </div>
  );
}

export default Box100;
