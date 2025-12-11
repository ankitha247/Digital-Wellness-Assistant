// frontend/src/components/AgentStream.jsx
import React, { useEffect, useState, useRef } from "react";

export default function AgentStream({ query, token, onFinal }) {
  const [events, setEvents] = useState([]); // array of {type, agent, text, time}
  const wsRef = useRef(null);

  useEffect(() => {
    if (!query) return;

    setEvents([]);
    // build ws url. Use ws:// for dev (http), wss:// for production (https)
    const WS_URL = `${window.location.protocol === "https:" ? "wss" : "ws"}://localhost:8000/ws/process-query`;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // send start message with query and optional token
      ws.send(JSON.stringify({ type: "start", query, token }));
    };

    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        const item = {
          type: payload.type || "agent",
          agent: payload.agent || "unknown",
          text: payload.text || "",
          time: new Date().toLocaleTimeString(),
        };
        setEvents((s) => [...s, item]);

        if (payload.type === "final") {
          onFinal && onFinal(payload);
          // optionally close connection:
          ws.close();
        }
      } catch (e) {
        console.error("Invalid message", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onclose = () => {
      // nothing
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [query]);

  // small helper to show agent display name / styles
  const agentLabel = (a) => {
    if (!a) return "agent";
    return a.replace("_", " ");
  };

  return (
    <div style={{ padding: 12, background: "#071226", color: "white", borderRadius: 8 }}>
      <div style={{ marginBottom: 8, color: "#9aa4b2" }}>
        Processing your question — agents interacting:
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <div style={{
              minWidth: 120,
              padding: "6px 8px",
              borderRadius: 8,
              background: "#0f3846",
              color: "#9fe0c3",
              textTransform: "capitalize",
              fontWeight: 700,
              fontSize: 13
            }}>
              {agentLabel(e.agent)}
            </div>
            <div style={{ background: "#071226", padding: 10, borderRadius: 8, flex: 1, border: "1px solid #0f2130" }}>
              <div style={{ fontSize: 14 }}>{e.text}</div>
              <div style={{ fontSize: 11, color: "#6f7b87", marginTop: 6 }}>{e.time}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator if latest not final */}
        {(!events.length || events[events.length - 1]?.type !== "final") && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
            <div style={{
              minWidth: 120,
              padding: "6px 8px",
              borderRadius: 8,
              background: "#0f2130",
              color: "#ffd36b",
              fontWeight: 700,
              fontSize: 13
            }}>
              thinking...
            </div>
            <div style={{ color: "#9aa4b2", fontSize: 13 }}>⠂⠂⠂</div>
          </div>
        )}
      </div>
    </div>
  );
}
