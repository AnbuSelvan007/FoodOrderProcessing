/**
 * FoodieGuy Real-time STOMP WebSocket Client Helper
 * Connects to ws://localhost:8080/ws/websocket (or SockJS) and manages subscriptions.
 */

type MessageCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private subscriptions: Map<string, Set<MessageCallback>> = new Map();
  private reconnectTimer: any = null;
  private subIdCounter = 0;

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      const wsUrl = `ws://${window.location.hostname}:8080/ws/websocket`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        // Send STOMP CONNECT frame
        this.sendFrame('CONNECT', { 'accept-version': '1.1,1.0', 'heart-beat': '10000,10000' });
      };

      this.socket.onmessage = (event) => {
        this.handleRawFrame(event.data);
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.socket?.close();
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }

  private sendFrame(command: string, headers: Record<string, string> = {}, body = '') {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    let frame = command + '\n';
    for (const [k, v] of Object.entries(headers)) {
      frame += `${k}:${v}\n`;
    }
    frame += '\n' + body + '\0';
    this.socket.send(frame);
  }

  private handleRawFrame(data: string) {
    if (!data) return;

    if (data.startsWith('CONNECTED')) {
      // Re-subscribe all active topics upon connection
      for (const topic of this.subscriptions.keys()) {
        this.subIdCounter++;
        this.sendFrame('SUBSCRIBE', { id: `sub-${this.subIdCounter}`, destination: topic });
      }
      return;
    }

    if (data.startsWith('MESSAGE')) {
      const bodyIndex = data.indexOf('\n\n');
      if (bodyIndex !== -1) {
        const headersStr = data.substring(0, bodyIndex);
        const bodyStr = data.substring(bodyIndex + 2).replace(/\0$/, '');
        
        let destination = '';
        const match = headersStr.match(/destination:(.+)/);
        if (match) {
          destination = match[1].trim();
        }

        let parsedData = bodyStr;
        try {
          parsedData = JSON.parse(bodyStr);
        } catch {
          // Keep raw string
        }

        if (destination && this.subscriptions.has(destination)) {
          const callbacks = this.subscriptions.get(destination)!;
          callbacks.forEach((cb) => cb(parsedData));
        }
      }
    }
  }

  public subscribe(topic: string, callback: MessageCallback): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      if (this.isConnected) {
        this.subIdCounter++;
        this.sendFrame('SUBSCRIBE', { id: `sub-${this.subIdCounter}`, destination: topic });
      }
    }

    this.subscriptions.get(topic)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          if (this.isConnected) {
            this.sendFrame('UNSUBSCRIBE', { id: `sub-${this.subIdCounter}` });
          }
        }
      }
    };
  }
}

export const webSocketService = new WebSocketService();
