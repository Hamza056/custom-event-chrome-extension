import { Box, Button, Typography } from "@mui/material";
import type { CustomNextPage } from "next";
// import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "src/layout";

// const Buttond = dynamic(
//   async () => {
//     const module = await import("src/components/Button");
//     return module.Button;
//   },
//   {
//     ssr: false,
//     loading: () => {
//       return <div className="w-10 h-4 bg-gray-100 rounded border animate-pulse"></div>;
//     },
//   },
// );

// eslint-disable-next-line

const IndexPage: CustomNextPage = () => {
  // eslint-disable-next-line
  const [message, setMessage] = useState<ResponseType | undefined>(undefined);
  type ResponseType = {
    data?: string; // Replace `string` with the actual type of data
    status?: string;
  };

  const [res, setres] = useState<ResponseType | undefined>(undefined);
  const handleSendMessageToBackground = async () => {
    // Create a delay function that returns a Promise
    // eslint-disable-next-line
    //@ts-ignore
    const delay = (ms) => {
      return new Promise((resolve) => {
        return setTimeout(resolve, ms);
      });
    };

    // Wait for the delay to finish
    await delay(800); // Delay in milliseconds (e.g., 1000ms = 1 second)

    // Send the message to the background script
    chrome.runtime.sendMessage({ type: "FORWARD_TO_CONTENT", data: message?.data }, (response) => {
      // Log the response from the content script
      // eslint-disable-next-line
      console.log("Response from content script:", response);
      setres(response);
    });
  };

  useEffect(() => {
    // Listen for custom events from the content script
    // eslint-disable-next-line
    console.log("running");

    // eslint-disable-next-line
    //@ts-ignore
    // eslint-disable-next-line
    const handleMyExtensionResponse = (request, sender, sendResponse) => {
      // eslint-disable-next-line
      console.log("Message received in popup:", request.message);
      if (!request.message.method) {
        chrome.runtime.sendMessage(
          { type: "FORWARD_TO_CONTENT", data: request.message },
          (response) => {
            // Log the response from the content script
            // eslint-disable-next-line
            console.log("Response from content script:", response);
            setMessage(response);
          },
        );
      }
    };
    // eslint-disable-next-line
    console.log(chrome.runtime.onMessage?.addListener(handleMyExtensionResponse));

    // Cleanup event listener on component unmount
    return () => {
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      window?.removeEventListener(handleMyExtensionResponse);
    };
  }, []);
  // eslint-disable-next-line
  console.log(res, "rrrr");

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
      <Typography variant="h6">Chrome Extension Template</Typography>
      {/* <Buttond /> */}
      <Button variant="contained" onClick={handleSendMessageToBackground}>
        Send Message to Background
      </Button>
      <div id="messageDisplay">{message?.data}</div>
      <div>{res?.status}</div>
      <div>{res?.data}</div>
      <Box>
        <Link href="/sample">
          <a className="text-white underline">to sample page</a>
        </Link>
      </Box>
    </Box>
  );
};

export default IndexPage;

IndexPage.getLayout = Layout;
