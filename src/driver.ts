import { Duplex } from "stream";

type Null = null;
type State = "connecting" | "open" | "closing" | "closed";

interface IWebsocketDriver extends Duplex {
  protocol: string;
  MAX_LENGTH: number;
  getState(): State | Null;
  addExtension(extension: string): boolean;
  setHeader(name: string, value: string): boolean;
  start(): boolean;
  send(message: string | ArrayBuffer): boolean;
  text(message: string): boolean;
  binary(message: ArrayBuffer): boolean;
  ping(): boolean;
  pong(): boolean;
  close(reason: string, code: number): boolean;
}

export default IWebsocketDriver;
