import { BLETransport } from "./ble";
import { saveMessage } from "./db";

export class ChatService {
  transport = new BLETransport();
  listeners = [];

  async init() {
    this.transport.onMessage = (msg) => {
      saveMessage(msg);
      this.listeners.forEach((l) => l(msg));
    };
    await this.transport.connect();
  }

  async send(text) {
    const message = {
      id: crypto.randomUUID(),
      text,
      ts: Date.now(),
      from: "me",
    };
    await saveMessage(message);
    await this.transport.sendMessage(message);
  }

  onMessage(cb) {
    this.listeners.push(cb);
  }
}
