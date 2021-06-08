import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const timestamp = () => new Date().toISOString();

const serverAddress = "ws://localhost:8080";

const client = new W3CWebSocket(serverAddress);

const App = () => {
  const [connected, setConnected] = useState(false);
  const [fullText, setFullText] = useState("");
  const [wordIndex, setWordIndex] = useState(-1);

  useEffect(() => {
    client.onopen = () => {
      console.log(`[${timestamp()}] Client connected`);
      setConnected(true);
      client.send(JSON.stringify({ content: "dashboardHandshake" }));
    };
    client.onmessage = (msg) => {
      console.log(`[${timestamp()}] Received: ${msg.data}`);
      const data = JSON.parse(msg.data);
      switch (data.content) {
        case "fullText":
          setFullText(data.text);
          break;
        case "currentWord":
          setWordIndex(data.wordIndex);
          break;

        default:
          console.log("IDK man");
          break;
      }
    };
    client.onclose = () => {
      setConnected(false);
    };
  }, []);
  return (
    <>
      <div className="page-container">
        <div className="page">
          <div className="centered-row">
            <h1>Mind-Wandering Experiment Dashboard</h1>
            {connected ? (
              <p>Connected to websocket server ✔</p>
            ) : (
              <p>Not connected to websocket server ❌</p>
            )}
          </div>
          <h2>Experiment Status</h2>
          <b>{`Current word index: ${wordIndex}`}</b>
          <div className="text-container">
            {fullText.split(" ").map((word, idx) => (
              <div className={idx === wordIndex ? "mx-1 bg-info" : "mx-1"}>
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
