/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/index.ts":
/*!*************************!*\
  !*** ./server/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dash_1 = __webpack_require__(/*! ./protocols/dash */ "./server/protocols/dash.ts");
new dash_1.Dash("video", "http://localhost:8000/data/output.mpd");


/***/ }),

/***/ "./server/protocols/dash.ts":
/*!**********************************!*\
  !*** ./server/protocols/dash.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Dash {
    constructor(id, url) {
        this.segmentIndex = 0;
        this.id = id;
        this.getDescription(url, () => this.initVideo(id));
    }
    getDescription(url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "document";
        xhr.overrideMimeType("text/xml");
        xhr.onload = event => {
            const mpd = xhr.responseXML;
            const representation = mpd.getElementsByTagName("Representation")[0];
            const mimeType = representation.getAttribute("mimeType");
            const codecs = representation.getAttribute("codecs");
            this.type = `${mimeType}; codecs="${codecs}"`;
            this.mpd = mpd;
            cb();
        };
        xhr.send(null);
    }
    initVideo(id) {
        const ms = new MediaSource();
        const video = document.getElementById(id);
        ms.addEventListener("sourceopen", this.initSourceBuffer.bind(this), false);
        video.src = URL.createObjectURL(ms);
        this.mediaSource = ms;
    }
    initSourceBuffer() {
        const sb = this.mediaSource.addSourceBuffer(this.type);
        sb.addEventListener("updateend", this.appendMediaSegment.bind(this), false);
        this.sourceBuffer = sb;
        this.appendInitSegment();
    }
    appendMediaSegment() {
        const xhr = new XMLHttpRequest();
        const file = this.mpd.getElementsByTagName("SegmentURL")[this.segmentIndex++].getAttribute("media");
        xhr.open("GET", `http://localhost:8000/data/${file}`, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = this.appendSegment.bind(this);
        xhr.send(null);
    }
    appendInitSegment() {
        const xhr = new XMLHttpRequest();
        const file = this.mpd.getElementsByTagName("Initialization")[0].getAttribute("sourceURL");
        xhr.open("GET", `http://localhost:8000/data/${file}`, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = this.appendSegment.bind(this);
        xhr.send(null);
    }
    appendSegment(event) {
        const target = event.target;
        this.sourceBuffer.appendBuffer(target.response);
    }
}
exports.Dash = Dash;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map