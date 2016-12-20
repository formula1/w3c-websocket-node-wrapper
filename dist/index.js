"use strict";
var events_1 = require("events");
var wsdriver = require("websocket-driver");
var websocketUtil = wsdriver.server;
var READYSTATE_CONSTANTS;
(function (READYSTATE_CONSTANTS) {
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["CONNECTING"] = 0] = "CONNECTING";
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["OPEN"] = 1] = "OPEN";
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["CLOSING"] = 2] = "CLOSING";
    READYSTATE_CONSTANTS[READYSTATE_CONSTANTS["CLOSED"] = 3] = "CLOSED";
})(READYSTATE_CONSTANTS || (READYSTATE_CONSTANTS = {}));
;
var DriverWebsocket = (function () {
    function DriverWebsocket(req, rawSocket) {
        this.ee = new events_1.EventEmitter();
        var ee = this.ee;
        if (!websocketUtil.isWebsocket(req)) {
            throw new Error("This request is not a valid websocket");
        }
        this._req = req;
        this._driver = websocketUtil.http(req);
        this._driver.on("open", function (e) {
            ee.emit("open", e);
        });
        this._driver.on("message", function (e) {
            ee.emit("message", e);
        });
        this._driver.on("error", function (e) {
            ee.emit("error", e);
        });
        this._driver.on("close", function (e) {
            ee.emit("close", e);
        });
        this._driver.pipe(rawSocket).pipe(this._driver);
        this._driver.start();
    }
    Object.defineProperty(DriverWebsocket.prototype, "binaryType", {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DriverWebsocket.prototype, "bufferedAmount", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "extensions", {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "protocol", {
        get: function () {
            return this._driver.protocol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "url", {
        get: function () {
            return this._req.url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "readyState", {
        get: function () {
            switch (this._driver.getState()) {
                case "connecting": return READYSTATE_CONSTANTS.CONNECTING;
                case "open": return READYSTATE_CONSTANTS.OPEN;
                case "closing": return READYSTATE_CONSTANTS.CLOSING;
                case "closed": return READYSTATE_CONSTANTS.CLOSED;
                default: throw new Error("unknown state " + this._driver.getState());
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "OPEN", {
        get: function () {
            return READYSTATE_CONSTANTS.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "CONNECTING", {
        get: function () {
            return READYSTATE_CONSTANTS.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "CLOSING", {
        get: function () {
            return READYSTATE_CONSTANTS.CLOSING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "CLOSED", {
        get: function () {
            return READYSTATE_CONSTANTS.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "onclose", {
        get: function () {
            return this.getFunctionVal("close");
        },
        set: function (v) {
            this.setFunctionVal("close", v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "onerror", {
        get: function () {
            return this.getFunctionVal("error");
        },
        set: function (v) {
            this.setFunctionVal("error", v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "onmessage", {
        get: function () {
            return this.getFunctionVal("message");
        },
        set: function (v) {
            this.setFunctionVal("message", v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverWebsocket.prototype, "onopen", {
        get: function () {
            return this.getFunctionVal("open");
        },
        set: function (v) {
            this.setFunctionVal("open", v);
        },
        enumerable: true,
        configurable: true
    });
    DriverWebsocket.prototype.close = function () {
        this._driver.close("Explicit Close", 10);
    };
    DriverWebsocket.prototype.send = function (str) {
        if (str instanceof ArrayBuffer) {
            this._driver.binary(str);
        }
        else {
            this._driver.text(str);
        }
    };
    DriverWebsocket.prototype.addEventListener = function (eventname, fn) {
        this.ee.addListener(eventname, fn);
    };
    DriverWebsocket.prototype.dispatchEvent = function (evt) {
        return false;
    };
    DriverWebsocket.prototype.removeEventListener = function (eventname, fn) {
        this.ee.removeListener(eventname, fn);
    };
    ;
    DriverWebsocket.prototype.getFunctionVal = function (eventname) {
        return this.mappedEvents.get(eventname);
    };
    DriverWebsocket.prototype.setFunctionVal = function (eventname, fn) {
        var prevFn = this.mappedEvents.get(eventname);
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
    };
    return DriverWebsocket;
}());
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DriverWebsocket;
