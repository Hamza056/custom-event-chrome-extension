// Function to handle arithmetic operations and return results
// eslint-disable-next-line
//@ts-ignore
// eslint-disable-next-line
async function handleRequest(request) {
  // eslint-disable-next-line
  //@ts-ignore
  const { method, params } = request.message;
  // eslint-disable-next-line
  //@ts-ignore
  // eslint-disable-next-line
  console.log(request, "ddd");

  let result;
  switch (method) {
    case "sum":
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      result = params.reduce((acc, num) => acc + num, 0);
      break;
    case "subtract":
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      result = params.reduce((acc, num) => acc - num);
      break;
    case "multiply":
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      result = params.reduce((acc, num) => acc * num, 1);
      break;
    case "divide":
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      result = params.reduce((acc, num) => acc / num);
      break;
    default:
      result = `${request.message}`;
  }
  // eslint-disable-next-line
  //@ts-ignore
  // eslint-disable-next-line
  function isPopupOpen(callback) {
    const popupUrl = chrome.runtime.getURL("./dist/index.html");

    chrome.windows.getAll({ populate: true }, (windows) => {
      let popupWindow = null;

      for (const window of windows) {
        // eslint-disable-next-line
        //@ts-ignore
        // eslint-disable-next-line
        if (window.type === "popup" && window.tabs.length > 0) {
          // Debugging logs
          // eslint-disable-next-line
          //@ts-ignore
          // eslint-disable-next-line
          console.log("Window ID:", window.id, "Tab URL:", window.tabs[0].url);
          // eslint-disable-next-line
          //@ts-ignore
          // eslint-disable-next-line
          if (window.tabs[0].url.startsWith(popupUrl)) {
            popupWindow = window;
            break;
          }
        }
      }

      callback(popupWindow);
    });
  }

  // Example usage
  // eslint-disable-next-line
  //@ts-ignore
  // eslint-disable-next-line
  isPopupOpen((popupWindow) => {
    if (popupWindow) {
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      console.log("Popup is already open:", popupWindow);
      // Focus on the existing popup window
      chrome.windows.update(popupWindow.id, { focused: true });
    } else {
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      console.log("Popup is not open, creating it.");
      chrome.windows.create({
        url: chrome.runtime.getURL("./dist/index.html"),
        type: "popup",
        height: 640,
        width: 410,
        left: 0,
        top: 0,
      });
    }
  });

  return { result };
}

// Listener for incoming messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Use the handleRequest function and send the response when it resolves
  // eslint-disable-next-line

  const { data, type } = request;
  if (type === "FORWARD_TO_CONTENT") {
    // eslint-disable-next-line
    //@ts-ignore
    // eslint-disable-next-line
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "FROM_POPUP", data: data }, (response) => {
          sendResponse(response); // Send the response back to popup.js
        });
      }
    });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  } else {
    handleRequest(request)
      .then((response) => {
        return sendResponse(response);
      })
      .catch((error) => {
        console.error("Error handling request:", error);
        sendResponse({ error: error.message });
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "FORWARD_TO_CONTENT") {
//     // Forward the message to the content script
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs[0]?.id) {
//         chrome.tabs.sendMessage(
//           tabs[0].id,
//           { type: "FROM_POPUP", data: request.data },
//           (response) => {
//             sendResponse(response); // Send the response back to popup.js
//           },
//         );
//       }
//     });

//     // Return true to indicate that the response will be sent asynchronously
//     return true;
//   }
// });

export {};
