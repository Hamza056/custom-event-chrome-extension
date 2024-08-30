// You may need to use relative path import.
// import { } from "../constants";

// eslint-disable-next-line no-console
console.log("content script fdfdf");

// If you want to get the DOM of the open page, you can do it here.
// document.querySelector("#some-id");

// wait sendMessage
// eslint-disable-next-line
// @ts-ignore
// Inject a script into the page to define `window.myExtension`
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
document.documentElement.appendChild(script);
document.documentElement.appendChild(script);

// Listen for messages from the web page
window.addEventListener("myExtensionMessage", async (event) => {
  try {
    // Log the event for debugging purposes
    // eslint-disable-next-line
    console.log(event);

    // Create an async function to handle the message sending
    // eslint-disable-next-line
    //@ts-ignore
    const sendMessageToBackground = async (message) => {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ message }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            // eslint-disable-next-line
            console.log(response);

            resolve(response);
          }
        });
      });
    };

    // Await the response from the background script
    // eslint-disable-next-line
    //@ts-ignore
    const response = await sendMessageToBackground(event.detail);

    // Log the response for debugging purposes
    // eslint-disable-next-line
    console.log("Response from background script:", response);
  } catch (error) {
    console.error("Error sending message to background script:", error);
  }
});

// Send messages to the web page
// eslint-disable-next-line
//@ts-ignore
// eslint-disable-next-line
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  window.dispatchEvent(new CustomEvent("myExtensionResponse", { detail: request }));
});
// eslint-disable-next-line
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // eslint-disable-next-line
  console.log("Received message in content script:", msg);
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // eslint-disable-next-line
  console.log(request);

  if (request.type === "FROM_POPUP") {
    // eslint-disable-next-line
    console.log("Message from popup via background script:", request.data);

    // Optionally, send a response back to the background script
    sendResponse({ status: "Received by content script" });
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FROM_POPUP") {
    // eslint-disable-next-line
    console.log("Received message in content script:", request.data);

    // Send a response back to the background script
    sendResponse({ status: "Message received in content script" });
  }
});

export {};
