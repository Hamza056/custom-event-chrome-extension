import { Box, Button, Typography } from "@mui/material";
import type { CustomNextPage } from "next";
// import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "src/layout";

// chrome APIを使用するためdynamic importし、browser側でのみ読み込まれるようにする
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
const handleSendMessageToBackground = () => {
  chrome.runtime.sendMessage(
    { type: "FORWARD_TO_CONTENT", data: "Hello from popup" },
    (response) => {
      // eslint-disable-next-line
      console.log("Response from content script:", response);
    },
  );
};
// eslint-disable-next-line

const IndexPage: CustomNextPage = () => {
  // eslint-disable-next-line
  const [message, setMessage] = useState();

  // popup.js
  useEffect(() => {
    // Add the message listener
    // eslint-disable-next-line
    //@ts-ignore
    const messageListener = (request, sender, sendResponse) => {
      if (request.message) {
        // eslint-disable-next-line
        console.log("Message received in popup:", request, sender, sendResponse);
        setMessage(request.message); // Update state with the received message
      }

      // Optionally, send a response back
      sendResponse({ received: true });
    };

    // Register the listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup the listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []); // Empty dependency array ensures this runs once on mount
  useEffect(() => {
    // Listen for custom events from the content script
    // eslint-disable-next-line
    //@ts-ignore
    // eslint-disable-next-line
    const handleMyExtensionResponse = (request, sender, sendResponse) => {
      // eslint-disable-next-line
      console.log("Message received in popup:", request.message);
      setMessage(request.message); // Update state with the received message
    };
    // eslint-disable-next-line
    console.log(chrome.runtime.onMessage.addListener(handleMyExtensionResponse), "sdsdds");

    // Cleanup event listener on component unmount
    return () => {
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      window.removeEventListener(handleMyExtensionResponse);
    };
  }, []);

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
      <div id="messageDisplay">{message}</div>
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
