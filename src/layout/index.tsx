import { ThemeProvider } from "@mui/material/styles";
import type { NextPage } from "next";
import theme from "src/theme";

import { LayoutErrorBoundary } from "./LayoutErrorBoundary";

export const Layout = (page: NextPage) => {
  return (
    <main>
      <ThemeProvider theme={theme}>
        <LayoutErrorBoundary>{page}</LayoutErrorBoundary>
      </ThemeProvider>

      {/* Loading Chrome scripts */}
      <script defer src="../content.js"></script>
      <script defer src="../background.js"></script>
    </main>
  );
};
