
import IWebsocketDriver from "./driver";
import { EventFunction, IWebSocket, IEvent } from "./IWebSocket";
import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
const wsdriver: any = require("websocket-driver");
const websocketUtil: {
  isWebsocket: (req: IncomingMessage) => boolean;
  http: (req: IncomingMessage, options?: Object) => IWebsocketDriver;
} = wsdriver.server;


enum READYSTATE_CONSTANTS {
  CONNECTING = 0,
  OPEN,
  CLOSING,
  CLOSED,
};

class DriverWebsocket implements IWebSocket {
  public any: any;
  public void: void;
  public get binaryType() {
    return "";
  };
  public get bufferedAmount() {
    return 0;
  }
  public get extensions() {
    return "";
  }
  public get protocol() {
    return this._driver.protocol;
  }
  public get url() {
    return this._req.url;
  }
  public get readyState() {
    switch (this._driver.getState()) {
      case "connecting" : return READYSTATE_CONSTANTS.CONNECTING;
      case "open" : return READYSTATE_CONSTANTS.OPEN;
      case "closing" : return READYSTATE_CONSTANTS.CLOSING;
      case "closed" : return READYSTATE_CONSTANTS.CLOSED;
      default: throw new Error(`unknown state ${this._driver.getState()}`);
    }
  }

  public get OPEN() {
    return READYSTATE_CONSTANTS.OPEN;
  }
  public get CONNECTING() {
    return READYSTATE_CONSTANTS.CONNECTING;
  }
  public get CLOSING() {
    return READYSTATE_CONSTANTS.CLOSING;
  }
  public get CLOSED() {
    return READYSTATE_CONSTANTS.CLOSED;
  }

  private mappedEvents: Map<string, EventFunction>;

  public get onclose() {
    return this.getFunctionVal("close");
  }
  public set onclose(v) {
    this.setFunctionVal("close", v);
  }
  public get onerror() {
    return this.getFunctionVal("error");
  }
  public set onerror(v) {
    this.setFunctionVal("error", v);
  }
  public get onmessage() {
    return this.getFunctionVal("message");
  }
  public set onmessage(v) {
    this.setFunctionVal("message", v);
  }
  public get onopen() {
    return this.getFunctionVal("open");
  }
  public set onopen(v){
    this.setFunctionVal("open", v);
  }

  private ee: EventEmitter;
  private _req: IncomingMessage;
  private _driver: IWebsocketDriver;

  constructor(req: IncomingMessage, rawSocket: Duplex) {
    this.ee = new EventEmitter();
    const ee = this.ee;
    if (!websocketUtil.isWebsocket(req)) {
      throw new Error("This request is not a valid websocket");
    }
    this._req = req;
    this._driver = websocketUtil.http(req);
    this._driver.on("open", (e) => {
      ee.emit("open", e);
    });
    this._driver.on("message", (e) => {
      ee.emit("message", e);
    });
    this._driver.on("error", (e) => {
      ee.emit("error", e);
    });
    this._driver.on("close", (e) => {
      ee.emit("close", e);
    });
    this._driver.pipe(rawSocket).pipe(this._driver);
    this._driver.start();
  }

  public close() {
    this._driver.close("Explicit Close", 10);
  }
  public send(str) {
    if (str instanceof ArrayBuffer) {
      this._driver.binary(str);
    } else {
      this._driver.text(str);
    }
  }
  public addEventListener(eventname, fn) {
    this.ee.addListener(eventname, fn);
  }

  public dispatchEvent(evt): boolean {
    return false;
  }

  public removeEventListener(eventname, fn) {
    this.ee.removeListener(eventname, fn);
  };

  private getFunctionVal(eventname) {
    return this.mappedEvents.get(eventname);
  }
  private setFunctionVal(eventname, fn): void {
    let prevFn = this.mappedEvents.get(eventname);
    if (prevFn === fn) {
      return;
    }
    if (typeof prevFn === "function") {
      this.removeEventListener(eventname, prevFn);
    }
    if (typeof fn === "function") {
      this.mappedEvents.set(eventname, fn);
      this.addEventListener(eventname, fn);
    } else {
      this.mappedEvents.delete(eventname);
    }
  }
};

export default DriverWebsocket;
export { IEvent, IWebSocket };
