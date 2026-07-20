const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = BASE_URL.replace(/^http/, 'ws') + '/ws';

let ws = null;
let reconnectTimer = null;
const listeners = {};

function getToken() {
  return localStorage.getItem('pyramids_token');
}

export function connectWebSocket() {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  const token = getToken();
  if (!token) return;

  ws = new WebSocket(`${WS_URL}?token=${token}`);

  ws.onopen = () => {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const type = data.type;
      if (type && listeners[type]) {
        listeners[type].forEach((fn) => fn(data.payload));
      }
    } catch (err) {
      console.warn('[ws] message parse error:', err);
    }
  };

  ws.onclose = () => {
    ws = null;
    reconnectTimer = setTimeout(connectWebSocket, 5000);
  };

  ws.onerror = () => { ws?.close(); };
}

export function disconnectWebSocket() {
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (ws) { ws.close(); ws = null; }
}

export function onWsEvent(type, fn) {
  if (!listeners[type]) listeners[type] = [];
  listeners[type].push(fn);
  return () => {
    listeners[type] = listeners[type].filter((f) => f !== fn);
  };
}
