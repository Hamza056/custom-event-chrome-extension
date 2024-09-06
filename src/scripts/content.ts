// content.js
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
console.log("Content script loaded");

// Inject the `inject.js` script into the page to define `window.myExtension`
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
document.documentElement.appendChild(script);

// Function to send a message to the background script and return the response
const sendMessageToBackground = async (message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "FROM_CONTENT", message }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        console.log("Response from background script:", response);
        resolve(response);
      }
    });
  });
};

// Listen for messages from the web page
window.addEventListener("myExtensionMessage", async (event) => {
  try {
    console.log("Message from web page:", event.detail);

    const response = await sendMessageToBackground(event.detail);
    console.log("Response from background script:", response);

    // Dispatch the response back to the web page
    window.dispatchEvent(new CustomEvent("myExtensionResponse", { detail: response }));
  } catch (error) {
    console.error("Error sending message to background script:", error);
  }
});

// Handle messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FROM_POPUP" || request.type === "FROM_POPUPd") {
    console.log(`Message from popup via background script (${request.type}):`, request.data);

    // Dispatch the message to the web page
    window.dispatchEvent(
      new CustomEvent("myExtensionResponse", {
        detail: { status: "Received by content script", data: request.data },
      }),
    );

    sendResponse({ status: "Received by content script", data: request.data });
  }
  return true; // Important to indicate an async response
});
export {};
