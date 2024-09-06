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

// Track the popup window ID and its state
let popupWindowId: number | null = null;
let isPopupOpen = false;

// Function to handle different operations
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

  await chrome.storage.local.set({ result });

  return { result };
};

// Function to open the popup window if it's not already open
const openPopup = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isPopupOpen) {
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
            isPopupOpen = true; // Update the state

            // Listen for the window being closed
            chrome.windows.onRemoved.addListener((windowId) => {
              if (windowId === popupWindowId) {
                console.log("Popup window closed, resetting popupWindowId and state.");
                popupWindowId = null; // Reset when the window is closed
                isPopupOpen = false; // Update the state
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

  // Common function to send a message to all active tabs
  const forwardToAllTabs = (messageType: string) => {
    chrome.tabs.query({}, (tabs) => {
      let pendingResponses = tabs.length;

      tabs.forEach((tab) => {
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, { type: messageType, data }, (response) => {
            console.log(response, "dsds");

            // Once all responses are collected, send them back
            if (--pendingResponses === 0) {
              sendResponse(response);
            }
          });
        }
      });
    });
    return true; // Indicate asynchronous response
  };

  if (type === "FORWARD_TO_CONTENT") {
    setTimeout(() => {
      forwardToAllTabs("FROM_POPUP");
    }, 2000); // 2-second delay
    return true;
  }

  if (type === "FORWARD_TO_CONTENTdd") {
    setTimeout(() => {
      forwardToAllTabs("FROM_POPUPd");
    }, 2000); // 2-second delay
    return true;
  } else {
    handleRequest(request)
      .then(async (response) => {
        console.log("Request handled. Popup status:", isPopupOpen, request, response);

        // Ensure popup is opened before sending the response
        await openPopup();

        // Send the response after opening the popup
        sendResponse(response);
      })
      .catch((error) => {
        console.error("Error handling request:", error);
        sendResponse({ error: error.message });
      });

    return true; // Indicate asynchronous response
  }
});

export {};
