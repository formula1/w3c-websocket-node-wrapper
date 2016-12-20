"use strict";
const events_1 = require("events");
const wsdriver = require("websocket-driver");
const websocketUtil = wsdriver.server;
var READYSTATE_CONSTANTS;
(function (READYSTATE_CONSTANTS) {
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["CONNECTING"] = 0] = "CONNECTING";
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["OPEN"] = 1] = "OPEN";
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["CLOSING"] = 2] = "CLOSING";
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["CLOSED"] = 3] = "CLOSED";
})(READYSTATE_CONSTANTS || (READYSTATE_CONSTANTS = {}));
;
class DriverWebsocket {
    get binaryType() {
        return "";
    }
    ;
    get bufferedAmount() {
        return 0;
    }
    get extensions() {
        return "";
    }
    get protocol() {
        return this._driver.protocol;
    }
    get url() {
        return this._req.url;
    }
    get readyState() {
        switch (this._driver.getState()) {
            case "connecting": return READYSTATE_CONSTANTS.CONNECTING;
            case "open": return READYSTATE_CONSTANTS.OPEN;
            case "closing": return READYSTATE_CONSTANTS.CLOSING;
            case "closed": return READYSTATE_CONSTANTS.CLOSED;
            default: throw new Error(`unknown state ${this._driver.getState()}`);
        }
    }
    get OPEN() {
        return READYSTATE_CONSTANTS.OPEN;
    }
    get CONNECTING() {
        return READYSTATE_CONSTANTS.CONNECTING;
    }
    get CLOSING() {
        return READYSTATE_CONSTANTS.CLOSING;
    }
    get CLOSED() {
        return READYSTATE_CONSTANTS.CLOSED;
    }
    get onclose() {
        return this.getFunctionVal("close");
    }
    set onclose(v) {
        this.setFunctionVal("close", v);
    }
    get onerror() {
        return this.getFunctionVal("error");
    }
    set onerror(v) {
        this.setFunctionVal("error", v);
    }
    get onmessage() {
        return this.getFunctionVal("message");
    }
    set onmessage(v) {
        this.setFunctionVal("message", v);
    }
    get onopen() {
        return this.getFunctionVal("open");
    }
    set onopen(v) {
        this.setFunctionVal("open", v);
    }
    constructor(req, rawSocket) {
        this.ee = new events_1.EventEmitter();
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
    close() {
        this._driver.close("Explicit Close", 10);
    }
    send(str) {
        if (str instanceof ArrayBuffer) {
            this._driver.binary(str);
        }
        else {
            this._driver.text(str);
        }
    }
    addEventListener(eventname, fn) {
        this.ee.addListener(eventname, fn);
    }
    dispatchEvent(evt) {
        return false;
    }
    removeEventListener(eventname, fn) {
        this.ee.removeListener(eventname, fn);
    }
    ;
    getFunctionVal(eventname) {
        return this.mappedEvents.get(eventname);
    }
    setFunctionVal(eventname, fn) {
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
        }
        else {
            this.mappedEvents.delete(eventname);
        }
    }
}
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DriverWebsocket;
