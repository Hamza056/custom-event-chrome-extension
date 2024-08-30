import { Box, Typography } from "@mui/material";
import type { CustomNextPage } from "next";
import Link from "next/link";
import { Layout } from "src/layout";

const SamplePage: CustomNextPage = () => {
  return (
    <Box
      sx={{
        //  min-width: 380px;
        // max-width: 100%;
        // height: 485px;
        // background: linear-gradient(153deg, rgb(116, 56, 216), rgb(18, 150, 170) 74%);
        // padding: 5px;
        // color: white;
        minWidth: "380px",
        maxWidth: "100%",
        height: "485px",
        background: "linear-gradient(153deg, rgb(116, 56, 216), rgb(18, 150, 170) 74%)",
        padding: "5px",
        color: "white",
      }}
    >
      <Typography variant="h6">Welcome Sample Page!</Typography>
      <Link href="/">
        <a className="text-white underline">go back index page</a>
      </Link>
    </Box>
  );
};

export default SamplePage;

SamplePage.getLayout = Layout;
