import { SERVICE_UUID, WRITE_UUID, NOTIFY_UUID, CHUNK_SIZE } from "./constants";

export class BLETransport {
  device;
  server;
  writeChar;
  notifyChar;
  buffer = new Map();
  onMessage;

  async connect() {
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }],
    });

    this.server = await this.device.gatt.connect();
    const service = await this.server.getPrimaryService(SERVICE_UUID);

    this.writeChar = await service.getCharacteristic(WRITE_UUID);
    this.notifyChar = await service.getCharacteristic(NOTIFY_UUID);

    await this.notifyChar.startNotifications();
    this.notifyChar.addEventListener("characteristicvaluechanged", (e) =>
      this.handleChunk(e)
    );
  }

  async sendMessage(payload) {
    const id = crypto.randomUUID();
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    const total = Math.ceil(encoded.length / CHUNK_SIZE);

    for (let i = 0; i < total; i++) {
      const chunk = encoded.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const frame = JSON.stringify({
        id,
        seq: i,
        total,
        data: Array.from(chunk),
      });
      await this.writeChar.writeValue(new TextEncoder().encode(frame));
    }
  }

  handleChunk(event) {
    const value = new TextDecoder().decode(event.target.value);
    const frame = JSON.parse(value);

    if (!this.buffer.has(frame.id)) {
      this.buffer.set(frame.id, []);
    }

    this.buffer.get(frame.id)[frame.seq] = frame.data;

    if (this.buffer.get(frame.id).filter(Boolean).length === frame.total) {
      const merged = this.buffer.get(frame.id).flat();
      this.buffer.delete(frame.id);
      const message = JSON.parse(
        new TextDecoder().decode(new Uint8Array(merged))
      );
      this.onMessage?.(message);
    }
  }
}
