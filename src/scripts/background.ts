interface RequestMessage {
  method: string;
  params?: number[];
  message?: any;
}

interface Request {
  message: RequestMessage;
  type?: string;
  data?: any;
}

// Track the popup window ID
let popupWindowId: number | null = null;

// Function to handle different operations
// eslint-disable-next-line
//@ts-ignore
const handleRequest = async (request: Request): Promise<{ result?: number | string }> => {
  const { method, params } = request.message;

  const operations: Record<string, (acc: number, num: number) => number> = {
    sum: (acc, num) => {
      return acc + num;
    },
    subtract: (acc, num) => {
      return acc - num;
    },
    multiply: (acc, num) => {
      return acc * num;
    },
    divide: (acc, num) => {
      return acc / num;
    },
  };

  let result: number | string | undefined;

  if (method in operations) {
    const initial = method === "multiply" ? 1 : 0;
    result = params?.reduce(operations[method], initial);
  } else {
    result = `${request.message}`;
  }
  console.log(result);
};

// Function to open the popup window if it's not already open
const openPopup = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (popupWindowId === null) {
      chrome.windows.create(
        {
          url: chrome.runtime.getURL("./dist/index.html"),
          type: "popup",
          width: 400,
          height: 600,
        },
        (popupWindow) => {
          if (popupWindow) {
            console.log("Popup opened:", popupWindow);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            popupWindowId = popupWindow.id; // Save the popup window ID

            // Listen for the window being closed
            chrome.windows.onRemoved.addListener((windowId) => {
              if (windowId === popupWindowId) {
                console.log("Popup window closed, resetting popupWindowId.");
                popupWindowId = null; // Reset when the window is closed
              }
            });
            resolve(); // Resolve once popup is opened
          } else {
            reject(new Error("Failed to open popup"));
          }
        },
      );
    } else {
      console.log("Popup already open.");
      resolve(); // Resolve if popup is already open
    }
  });
};

// Listener for incoming messages from popup or content script
chrome.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
  const { type, data } = request;

  if (type === "FORWARD_TO_CONTENT") {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        setTimeout(() => {
          chrome.tabs.sendMessage(tabs[0].id!, { type: "FROM_POPUP", data }, sendResponse);
        }, 2000); // 2-second delay
      }
    });
    return true; // Indicate asynchronous response
  } else {
    handleRequest(request)
      .then(async (response) => {
        // Open the popup first
        console.log(response, "ssdsd");

        openPopup();

        await setTimeout(() => {
          sendResponse(response);
        }, 2000); // 2-second delay
      })
      .catch((error) => {
        console.error("Error handling request:", error);
        sendResponse({ error: error.message });
      });
    return true; // Indicate asynchronous response
  }
});

export {};
