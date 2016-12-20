
interface IEventTarget {
  addEventListener(eventname: string, fn: EventFunction): void;
  removeEventListener(eventname: string, fn: EventFunction): void;
  dispatchEvent(evt: IEvent): boolean;
}

enum EventPhase {
  NONE = 0,
  CAPTURING_PHASE,
  AT_TARGET,
  BUBBLING_PHASE,
}

interface IEvent {
  readonly NONE: EventPhase;
  readonly CAPTURING_PHASE: EventPhase;
  readonly AT_TARGET: EventPhase;
  readonly BUBBLING_PHASE: EventPhase;
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  deepPath: { () : Array<IEventTarget> } | { () : Array<IEventTarget>, () : Array<IEventTarget> };
  cancelBubble: boolean;
  returnValue: boolean;
  readonly defaultPrevented: boolean;
  readonly eventPhase: EventPhase;
  readonly scoped: boolean;
  readonly currentTarget: any;
  readonly target: any;
  srcElement: any;
  readonly timeStamp: number;
  readonly type: string;
  readonly isTrusted: boolean;
  initEvent(): void;
  preventDefault(): void;
  stopImmediatePropagation(): void;
  stopPropagation(): void;
}

declare type EventFunction = (ev: IEvent) => any;

enum READYSTATE_CONSTANTS {
  CONNECTING = 0,
  OPEN,
  CLOSING,
  CLOSED,
};

 interface IWebSocket {
  binaryType: string;
  bufferedAmount: number;
  extensions: string;
  protocol: string;
  url: string;
  readyState: READYSTATE_CONSTANTS;
  OPEN: READYSTATE_CONSTANTS;
  CONNECTING: READYSTATE_CONSTANTS;
  CLOSING: READYSTATE_CONSTANTS;
  CLOSED: READYSTATE_CONSTANTS;
  onclose: EventFunction;
  onerror: EventFunction;
  onmessage: EventFunction;
  onopen: EventFunction;
  close(): void;
  send(str: string | ArrayBuffer): void;
  addEventListener(eventname: string, fn: EventFunction): void;
  removeEventListener(eventname: string, fn: EventFunction): void;
  dispatchEvent(evt: IEvent): boolean;
}

export { IWebSocket, IEvent, EventFunction };
