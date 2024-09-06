import { Box, Button, Typography } from "@mui/material";
import type { CustomNextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "src/layout";

const IndexPage: CustomNextPage = () => {
  const [message, setMessage] = useState<ResponseType | undefined>(undefined);
  const [res, setRes] = useState<ResponseType | undefined>(undefined);

  type ResponseType = {
    data?: string; // Replace `string` with the actual type of data
    status?: string;
  };

  const handleSendMessageToBackground = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(800); // Delay in milliseconds (e.g., 1000ms = 1 second)

    chrome.runtime.sendMessage(
      { type: "FORWARD_TO_CONTENTdd", data: message?.data },
      (response) => {
        console.log("Response from content script:", response);
        setRes(response);
      },
    );
  };

  useEffect(() => {
    const fetchResult = async () => {
      chrome.storage.local.get("result", (items) => {
        console.log("Stored result:", items.result);
        if (items.result) {
          setMessage({ data: items.result as string });
        }
      });
    };

    fetchResult();

    // Listen for custom events from the content script
    const handleMyExtensionResponse = (request: any, _sender: any, _sendResponse: any) => {
      console.log("Message received in popup:", request.message);
      if (!request.message.method) {
        chrome.runtime.sendMessage(
          { type: "FORWARD_TO_CONTENTdd", data: request.message },
          (response) => {
            console.log("Response from content script:", response);
            setRes(response);
          },
        );
      }
    };

    chrome.runtime.onMessage.addListener(handleMyExtensionResponse);

    // Cleanup event listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleMyExtensionResponse);
    };
  }, []);

  return (
    <Box
      sx={{
        minWidth: "380px",
        maxWidth: "100%",
        height: "485px",
        background: "linear-gradient(153deg, rgb(116, 56, 216), rgb(18, 150, 170) 74%)",
        padding: "5px",
        color: "white",
      }}
    >
      <Typography variant="h6">Chrome Extension Template</Typography>
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
