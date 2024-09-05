// Log for debugging purposes
console.log("Content script loaded");

// If you want to get the DOM of the open page, you can do it here
// document.querySelector("#some-id");

// Inject a script into the page to define `window.myExtension`
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
document.documentElement.appendChild(script);

// Listen for messages from the web page
// eslint-disable-next-line
//@ts-ignore
window.addEventListener("myExtensionMessage", async (event: CustomEvent) => {
  try {
    console.log(event);

    const sendMessageToBackground = async (message: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ message }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            console.log(response);
            resolve(response);
          }
        });
      });
    };

    const response = await sendMessageToBackground(event.detail);
    console.log("Response from background script:", response);
  } catch (error) {
    console.error("Error sending message to background script:", error);
  }
});

// Send messages to the web page

// Log received messages for debugging

// Handle messages from popup via background script
chrome.runtime.onMessage.addListener(
  (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    if (request.type === "FROM_POPUP") {
      console.log("Message from popup via background script:", request.data);
      sendResponse({ status: "Received by content script", data: request.data });
    }
  },
);

export {};
