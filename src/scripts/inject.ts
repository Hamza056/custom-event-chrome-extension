// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
type Message = string | object; // Define a more precise type if needed

class MyExtension {
  private messages: Message[]; // Array to store messages

  constructor() {
    this.messages = [];
    this.initialize();
    this.addMessageHandler(); // Add handler to listen for data requests
  }

  // Initialization to expose window.myExtension
  private initialize(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.myExtension = {
      sendMessage: this.sendMessage.bind(this),
      getMessages: this.getMessages.bind(this),
      on: this.on.bind(this), // Listen for custom events
    };
  }

  // Method to send a message and listen for a response
  async sendMessage(message: Message): Promise<{ initialMessage: Message; [key: string]: any }> {
    return new Promise((resolve) => {
      const onResponse = (event: Event) => {
        const customEvent = event as CustomEvent;
        resolve({
          initialMessage: message,
          ...customEvent.detail,
        });
        window.removeEventListener("myExtensionResponse", onResponse);
      };

      window.addEventListener("myExtensionResponse", onResponse);

      // Store the message and dispatch it
      this.messages.push(message);
      window.dispatchEvent(new CustomEvent("myExtensionMessage", { detail: message }));
    });
  }

  // Method to get all stored messages
  getMessages(): Message[] {
    return this.messages;
  }

  // Method to listen for custom events
  on(eventType: string, callback: (detail: any) => void): void {
    window.addEventListener(eventType, (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    });
  }

  // Handler for getting stored messages
  private addMessageHandler(): void {
    window.addEventListener("myExtensionGetData", (_event: Event) => {
      console.log("Received request to get stored data:", this.messages);
      window.dispatchEvent(new CustomEvent("myExtensionData", { detail: this.messages }));
    });
  }
}

// Extend the window object to include our extension
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
declare global {
  interface Window {
    myExtension: {
      sendMessage: (message: Message) => Promise<{ initialMessage: Message; [key: string]: any }>;
      getMessages: () => Message[];
      on: (eventType: string, callback: (detail: any) => void) => void;
    };
  }
}

// Initialize the extension
new MyExtension();
