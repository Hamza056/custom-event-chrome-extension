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

  if (method === "open") {
    const popupUrl = chrome.runtime.getURL("./dist/index.html");

    const isPopupOpen = (callback: (popupWindow: chrome.windows.Window | null) => void) => {
      chrome.windows.getAll({ populate: true }, (windows) => {
        const popupWindow =
          windows.find((window) => {
            return window.type === "popup" && window.tabs?.[0]?.url?.startsWith(popupUrl);
          }) || null;
        callback(popupWindow);
      });
    };

    isPopupOpen((popupWindow) => {
      if (popupWindow) {
        console.log("Popup is already open:", popupWindow);
        chrome.windows.update(popupWindow.id!, { focused: true });
      } else {
        console.log("Popup is not open, creating it.");
        chrome.windows.create({
          url: popupUrl,
          type: "popup",
          height: 640,
          width: 410,
          left: 0,
          top: 0,
        });
      }
    });

    return {};
  }

  return { result };
};

// Listener for incoming messages
chrome.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
  const { type, data } = request;

  if (type === "FORWARD_TO_CONTENT") {
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
      .then((response) => {
        return setTimeout(() => {
          return sendResponse(response);
        }, 2000);
      }) // 2-second delay
      .catch((error) => {
        console.error("Error handling request:", error);
        sendResponse({ error: error.message });
      });
    return true; // Indicate asynchronous response
  }
});

export {};
