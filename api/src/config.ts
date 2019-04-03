const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://lddui.erben.sh";

export { baseUrl };
