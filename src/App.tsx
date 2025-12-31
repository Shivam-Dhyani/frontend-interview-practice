// function App() {
//   return (
//     <div className="p-6">
//       <span className="text-2xl font-bold">Frontend Interview</span>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import { ChatService } from "./config/chatService";
import { getMessages } from "./config/db";

const chat = new ChatService();

export default function App() {
  const [messages, setMessages] = useState<any>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getMessages().then(setMessages);
    chat.onMessage((msg: any) => setMessages((m: any) => [...m, msg]));
  }, []);

  async function connect() {
    await chat.init();
  }

  async function send() {
    if (!text) return;
    await chat.send(text);
    setText("");
    setMessages(await getMessages());
  }

  return (
    <div style={{ padding: 16 }}>
      <button onClick={connect}>Connect Nearby</button>

      <div style={{ marginTop: 16 }}>
        {messages.map((m) => (
          <div key={m.id}>{m.text}</div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", marginTop: 16 }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
