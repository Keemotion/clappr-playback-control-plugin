(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["clappr"], factory);
	else if(typeof exports === 'object')
		exports["PlaybackControlPlugin"] = factory(require("clappr"));
	else
		root["PlaybackControlPlugin"] = factory(root["clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "<%=baseUrl%>/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./src/plugin.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _clappr = __webpack_require__(/*! clappr */ 5);
	
	var _clappr2 = _interopRequireDefault(_clappr);
	
	var _mousetrap = __webpack_require__(/*! mousetrap */ 4);
	
	var _mousetrap2 = _interopRequireDefault(_mousetrap);
	
	var _view = __webpack_require__(/*! ./view.html */ 3);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _style = __webpack_require__(/*! ./style.scss */ 1);
	
	var _style2 = _interopRequireDefault(_style);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global PLUGIN_VERSION */
	// node
	// vendors
	
	// project
	
	
	// locals
	var SCALE_FRAMES = 'frames';
	var SCALE_SECONDS = 'seconds';
	var BUTTON_STATE_DOWN = 'down';
	var BUTTON_STATE_UP = 'up';
	
	var FPS_DEFAULT = 29;
	
	var PlaybackControl = function (_Clappr$UICorePlugin) {
	  _inherits(PlaybackControl, _Clappr$UICorePlugin);
	
	  function PlaybackControl() {
	    _classCallCheck(this, PlaybackControl);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlaybackControl).apply(this, arguments));
	  }
	
	  _createClass(PlaybackControl, [{
	    key: 'onContainerChanged',
	
	    // methods
	    value: function onContainerChanged() {
	      this.invalidate();
	    }
	  }, {
	    key: 'seekScaleValue',
	    value: function seekScaleValue(scale, value) {
	      switch (scale) {
	        case SCALE_FRAMES:
	          this.seekRelativeFrames(value);
	          break;
	        case SCALE_SECONDS:
	          this.seekRelativeSeconds(value);
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: 'findButton',
	    value: function findButton(scale, value) {
	      var signed = value > 0 ? '+' + value : value;
	      return this.$el.find('[data-step-scale="' + scale + '"][data-step-value="' + signed + '"]');
	    }
	  }, {
	    key: 'highlightButton',
	    value: function highlightButton(scale, value, state) {
	      var button = this.findButton(scale, value);
	      switch (state) {
	        case BUTTON_STATE_DOWN:
	          button.children()[1].className = 'playback-control-action-highlight';
	          break;
	        case BUTTON_STATE_UP:
	          button.children()[1].className = '';
	          break;
	        default:
	          break;
	      }
	      return button;
	    }
	  }, {
	    key: 'onButtonClick',
	    value: function onButtonClick(e) {
	      var sender = e.currentTarget;
	      var scale = sender.getAttribute('data-step-scale');
	      var value = Number(sender.getAttribute('data-step-value'));
	      // control player
	      this.seekScaleValue(scale, value);
	    }
	  }, {
	    key: 'onActionsMouseWheel',
	    value: function onActionsMouseWheel(e) {
	      var sender = e.currentTarget;
	      var scale = sender.getAttribute('data-step-scale');
	      var value = e.detail < 0 || e.wheelDelta > 0 ? 1 : -1;
	      this.seekScaleValue(scale, value);
	      e.stopPropagation();
	      e.preventDefault();
	      return false;
	    }
	  }, {
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this2 = this;
	
	      // const config = this.config;
	      var player = this.player;
	      this.listenTo(this.mediaControl, _clappr2.default.Events.MEDIACONTROL_RENDERED, this.render);
	      this.listenTo(this.mediaControl, _clappr2.default.Events.MEDIACONTROL_CONTAINERCHANGED, this.onContainerChanged);
	      // non-clappr events
	      _mousetrap2.default.addKeycodes({ 144: 'numlock' });
	      // standard keyboard shortcuts
	      _mousetrap2.default.bind('q', function () {
	        return _this2.highlightButton(SCALE_SECONDS, -1, BUTTON_STATE_DOWN);
	      }, 'keydown');
	      _mousetrap2.default.bind('q', function () {
	        _this2.highlightButton(SCALE_SECONDS, -1, BUTTON_STATE_UP);
	        _this2.seekRelativeSeconds(-1);
	      }, 'keyup');
	      _mousetrap2.default.bind('w', function () {
	        return _this2.highlightButton(SCALE_SECONDS, +1, BUTTON_STATE_DOWN);
	      }, 'keydown');
	      _mousetrap2.default.bind('w', function () {
	        _this2.highlightButton(SCALE_SECONDS, +1, BUTTON_STATE_UP);
	        _this2.seekRelativeSeconds(+1);
	      }, 'keyup');
	      _mousetrap2.default.bind('a', function () {
	        return _this2.highlightButton(SCALE_FRAMES, -1, BUTTON_STATE_DOWN);
	      }, 'keydown');
	      _mousetrap2.default.bind('a', function () {
	        _this2.highlightButton(SCALE_FRAMES, -1, BUTTON_STATE_UP);
	        _this2.seekRelativeFrames(-1);
	      }, 'keyup');
	      _mousetrap2.default.bind('s', function () {
	        return _this2.highlightButton(SCALE_FRAMES, +1, BUTTON_STATE_DOWN);
	      }, 'keydown');
	      _mousetrap2.default.bind('s', function () {
	        _this2.highlightButton(SCALE_FRAMES, +1, BUTTON_STATE_UP);
	        _this2.seekRelativeFrames(+1);
	      }, 'keyup');
	      _mousetrap2.default.bind('space', function () {
	        if (player.isPlaying()) {
	          player.pause();
	        } else {
	          player.play();
	        }
	      });
	      // shuttle xpress - large wheel with arrow keys fallback(time control)
	      _mousetrap2.default.bind('up', function () {
	        return _this2.seekRelativeSeconds(-1);
	      });
	      _mousetrap2.default.bind('down', function () {
	        return _this2.seekRelativeSeconds(+1);
	      });
	      // shuttle xpress - small wheel with arrow keys fallback(time control)
	      _mousetrap2.default.bind('left', function () {
	        return _this2.seekRelativeFrames(-1);
	      });
	      _mousetrap2.default.bind('right', function () {
	        return _this2.seekRelativeFrames(+1);
	      });
	      // shuttle xpress - small wheel with ctrl +/- keys combo fallback(frame control)
	      _mousetrap2.default.bind('ctrl+-', function (e) {
	        e.preventDefault();
	        e.stopPropagation();
	        _this2.seekRelativeFrames(-1);
	      });
	      _mousetrap2.default.bind(['ctrl+=', 'ctrl+plus'], function (e) {
	        e.preventDefault();
	        e.stopPropagation();
	        _this2.seekRelativeFrames(+1);
	      });
	      // shuttle express - buttons(numeric keys fallback)
	      var switchPlaybackRate = function switchPlaybackRate(e, rate) {
	        e.preventDefault();
	        e.stopPropagation();
	        _this2.mediaControl.trigger('playbackRate', rate);
	        return false;
	      };
	      _mousetrap2.default.bind('0', function (e) {
	        return switchPlaybackRate(e, 0.5);
	      });
	      _mousetrap2.default.bind(['1', 'numlock+alt+left'], function (e) {
	        return switchPlaybackRate(e, 1);
	      });
	      _mousetrap2.default.bind(['2', 'numlock+ctrl+h'], function (e) {
	        return switchPlaybackRate(e, 2);
	      });
	      _mousetrap2.default.bind(['3', 'ctrl+shift+o', 'numlock+ctrl+i'], function (e) {
	        return switchPlaybackRate(e, 3);
	      });
	      _mousetrap2.default.bind(['4', 'numlock+ctrl+t'], function (e) {
	        return switchPlaybackRate(e, 4);
	      });
	      _mousetrap2.default.bind(['5', 'numlock+alt+right'], function (e) {
	        return switchPlaybackRate(e, 5);
	      });
	      _mousetrap2.default.bind('6', function (e) {
	        return switchPlaybackRate(e, 6);
	      });
	      _mousetrap2.default.bind('7', function (e) {
	        return switchPlaybackRate(e, 7);
	      });
	      _mousetrap2.default.bind('8', function (e) {
	        return switchPlaybackRate(e, 8);
	      });
	      _mousetrap2.default.bind('9', function (e) {
	        return switchPlaybackRate(e, 9);
	      });
	    }
	  }, {
	    key: 'stopListening',
	    value: function stopListening() {
	      _get(Object.getPrototypeOf(PlaybackControl.prototype), 'stopListening', this).call(this);
	      // non-clappr events
	      if (this.onMouseWheelDelegate) {
	        this.onMouseWheelDelegate.unbind();
	        this.onMouseWheelDelegate = null;
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var style = _clappr2.default.Styler.getStyleFor(_style2.default);
	      this.$el.html(this.template()).append(style);
	      this.$el.find('[type="button"]').off('click').on('click', this.onButtonClick.bind(this));
	      this.$el.find('.playback-control-actions').off('DOMMouseScroll').on('DOMMouseScroll', this.onActionsMouseWheel.bind(this));
	      this.$el.find('.playback-control-actions').off('mousewheel').on('mousewheel', this.onActionsMouseWheel.bind(this));
	      this.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.el);
	      return this;
	    }
	  }, {
	    key: 'invalidate',
	    value: function invalidate() {
	      this.stopListening();
	      this.bindEvents();
	    }
	  }, {
	    key: 'getFPS',
	    value: function getFPS() {
	      var fps = FPS_DEFAULT;
	      if (this.player && this.player.options && this.player.options.playbackControl) {
	        fps = this.player.options.playbackControl.fps || fps;
	      }
	      return fps;
	    }
	  }, {
	    key: 'seekRelativeFrames',
	    value: function seekRelativeFrames(frames) {
	      var player = this.player;
	      if (player.isPlaying()) {
	        player.pause();
	      }
	      var currentTime = player.getCurrentTime();
	      var targetTime = currentTime + frames / this.getFPS();
	      if (targetTime <= 0 || targetTime >= player.getDuration()) {
	        // TODO: decide on how to norm bounds
	      } else {
	        var playback = this.core.getCurrentPlayback();
	        player.seek(targetTime);
	        // Trigger the waiting event that will buffer the video if targetTime is not buffered yet
	        var bufferedTimeRange = playback.el.buffered;
	        var targetFrameBuffered = false;
	        for (var i = 0; i < bufferedTimeRange.length; i++) {
	          if (targetTime >= bufferedTimeRange.start(i) && targetTime <= bufferedTimeRange.end(i)) {
	            targetFrameBuffered = true;
	            break;
	          }
	        }
	        if (!targetFrameBuffered) {
	          playback.trigger('waiting');
	        }
	      }
	    }
	  }, {
	    key: 'seekRelativeSeconds',
	    value: function seekRelativeSeconds(seconds) {
	      var player = this.player;
	      if (player.isPlaying()) {
	        player.pause();
	      }
	      var position = player.getCurrentTime() + seconds;
	      if (position < 0) {
	        position = 0;
	      } else if (position > player.getDuration()) {
	        position = player.getDuration();
	      }
	      player.seek(position);
	    }
	  }, {
	    key: 'name',
	
	    // properties
	    get: function get() {
	      return 'playback_control';
	    }
	  }, {
	    key: 'version',
	    get: function get() {
	      return PLUGIN_VERSION;
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _clappr2.default.template(_view2.default);
	    }
	  }, {
	    key: 'attributes',
	    get: function get() {
	      return { class: 'playback-control' };
	    }
	  }, {
	    key: 'mediaControl',
	    get: function get() {
	      return this.core.mediaControl;
	    }
	  }, {
	    key: 'player',
	    get: function get() {
	      return this.mediaControl.container;
	    }
	  }, {
	    key: 'config',
	    get: function get() {
	      return this.core.options.playbackControlConfig || { keyBindings: [] };
	    }
	  }]);
	
	  return PlaybackControl;
	}(_clappr2.default.UICorePlugin);
	
	exports.default = PlaybackControl;

/***/ },
/* 1 */
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../~/css-loader/lib/css-base.js */ 2)();
	// imports
	
	
	// module
	exports.push([module.id, "[data-player] div.playback-control {\n  float: left; }\n  [data-player] div.playback-control > .playback-control-actions {\n    display: inline-block;\n    margin-left: 1px;\n    margin-right: 1px;\n    height: 28px; }\n    [data-player] div.playback-control > .playback-control-actions:hover {\n      background: #eee; }\n    [data-player] div.playback-control > .playback-control-actions > button {\n      outline: none;\n      cursor: pointer;\n      border: 1px solid #444;\n      margin: 1px;\n      text-align: center;\n      width: 35px;\n      height: 26px; }\n      [data-player] div.playback-control > .playback-control-actions > button > sub {\n        outline: none;\n        position: relative;\n        display: inline-block;\n        background: #eee;\n        border-radius: 15px;\n        width: 25px;\n        border: 1px solid;\n        left: -2px;\n        bottom: 0;\n        font-weight: bold;\n        font-family: Consolas, Lucida Console, Monaco, monospace;\n        font-size: 11px; }\n        [data-player] div.playback-control > .playback-control-actions > button > sub.playback-control-action-highlight {\n          background: #febf04;\n          border-color: #333;\n          color: #333;\n          position: relative;\n          top: 1px;\n          left: 1px; }\n      [data-player] div.playback-control > .playback-control-actions > button:hover {\n        background: #333;\n        color: #eee; }\n        [data-player] div.playback-control > .playback-control-actions > button:hover > sub {\n          border-color: #eee;\n          color: #333; }\n      [data-player] div.playback-control > .playback-control-actions > button:active {\n        background: #666;\n        color: #333;\n        border-color: #111;\n        position: relative;\n        top: 1px; }\n        [data-player] div.playback-control > .playback-control-actions > button:active > sub {\n          background: #111;\n          color: #666;\n          border-color: #111;\n          font-weight: bold; }\n    [data-player] div.playback-control > .playback-control-actions > button::-moz-focus-inner {\n      border: 0; }\n  [data-player] div.playback-control > .playback-control-actions[data-step-scale=\"seconds\"] > button {\n    background: #00b7ea; }\n  [data-player] div.playback-control > .playback-control-actions[data-step-scale=\"frames\"] > button {\n    background: #d2ff52; }\n", ""]);
	
	// exports


/***/ },
/* 2 */
/*!**************************************!*\
  !*** ./~/css-loader/lib/css-base.js ***!
  \**************************************/
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 3 */
/*!***********************!*\
  !*** ./src/view.html ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = "<div class=\"playback-control-actions\" data-step-scale=\"seconds\">\n  <button type=\"button\" data-step-value=\"-1\" data-step-scale=\"seconds\" title=\"Step 1 second backward\">\n    <p>-1</p>\n    <sub>Q</sub>\n  </button>\n  <button type=\"button\" data-step-value=\"+1\" data-step-scale=\"seconds\" title=\"Step 1 second forward\">\n    <p>+1</p>\n    <sub>W</sub>\n  </button>\n</div>\n<div class=\"playback-control-actions\" data-step-scale=\"frames\">\n  <button type=\"button\" data-step-value=\"-1\" data-step-scale=\"frames\" title=\"Step 1 frame backward\">\n    <p>-1</p>\n    <sub>A</sub>\n  </button>\n  <button type=\"button\" data-step-value=\"+1\" data-step-scale=\"frames\" title=\"Step 1 frame forward\">\n    <p>+1</p>\n    <sub>S</sub>\n  </button>\n</div>\n";

/***/ },
/* 4 */
/*!**********************************!*\
  !*** ./~/mousetrap/mousetrap.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*global define:false */
	/**
	 * Copyright 2016 Craig Campbell
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * Mousetrap is a simple keyboard shortcut library for Javascript with
	 * no external dependencies
	 *
	 * @version 1.6.0
	 * @url craig.is/killing/mice
	 */
	(function(window, document, undefined) {
	
	    // Check if mousetrap is used inside browser, if not, return
	    if (!window) {
	        return;
	    }
	
	    /**
	     * mapping of special keycodes to their corresponding keys
	     *
	     * everything in this dictionary cannot use keypress events
	     * so it has to be here to map to the correct keycodes for
	     * keyup/keydown events
	     *
	     * @type {Object}
	     */
	    var _MAP = {
	        8: 'backspace',
	        9: 'tab',
	        13: 'enter',
	        16: 'shift',
	        17: 'ctrl',
	        18: 'alt',
	        20: 'capslock',
	        27: 'esc',
	        32: 'space',
	        33: 'pageup',
	        34: 'pagedown',
	        35: 'end',
	        36: 'home',
	        37: 'left',
	        38: 'up',
	        39: 'right',
	        40: 'down',
	        45: 'ins',
	        46: 'del',
	        91: 'meta',
	        93: 'meta',
	        224: 'meta'
	    };
	
	    /**
	     * mapping for special characters so they can support
	     *
	     * this dictionary is only used incase you want to bind a
	     * keyup or keydown event to one of these keys
	     *
	     * @type {Object}
	     */
	    var _KEYCODE_MAP = {
	        106: '*',
	        107: '+',
	        109: '-',
	        110: '.',
	        111 : '/',
	        186: ';',
	        187: '=',
	        188: ',',
	        189: '-',
	        190: '.',
	        191: '/',
	        192: '`',
	        219: '[',
	        220: '\\',
	        221: ']',
	        222: '\''
	    };
	
	    /**
	     * this is a mapping of keys that require shift on a US keypad
	     * back to the non shift equivelents
	     *
	     * this is so you can use keyup events with these keys
	     *
	     * note that this will only work reliably on US keyboards
	     *
	     * @type {Object}
	     */
	    var _SHIFT_MAP = {
	        '~': '`',
	        '!': '1',
	        '@': '2',
	        '#': '3',
	        '$': '4',
	        '%': '5',
	        '^': '6',
	        '&': '7',
	        '*': '8',
	        '(': '9',
	        ')': '0',
	        '_': '-',
	        '+': '=',
	        ':': ';',
	        '\"': '\'',
	        '<': ',',
	        '>': '.',
	        '?': '/',
	        '|': '\\'
	    };
	
	    /**
	     * this is a list of special strings you can use to map
	     * to modifier keys when you specify your keyboard shortcuts
	     *
	     * @type {Object}
	     */
	    var _SPECIAL_ALIASES = {
	        'option': 'alt',
	        'command': 'meta',
	        'return': 'enter',
	        'escape': 'esc',
	        'plus': '+',
	        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
	    };
	
	    /**
	     * variable to store the flipped version of _MAP from above
	     * needed to check if we should use keypress or not when no action
	     * is specified
	     *
	     * @type {Object|undefined}
	     */
	    var _REVERSE_MAP;
	
	    /**
	     * loop through the f keys, f1 to f19 and add them to the map
	     * programatically
	     */
	    for (var i = 1; i < 20; ++i) {
	        _MAP[111 + i] = 'f' + i;
	    }
	
	    /**
	     * loop through to map numbers on the numeric keypad
	     */
	    for (i = 0; i <= 9; ++i) {
	        _MAP[i + 96] = i;
	    }
	
	    /**
	     * cross browser add event method
	     *
	     * @param {Element|HTMLDocument} object
	     * @param {string} type
	     * @param {Function} callback
	     * @returns void
	     */
	    function _addEvent(object, type, callback) {
	        if (object.addEventListener) {
	            object.addEventListener(type, callback, false);
	            return;
	        }
	
	        object.attachEvent('on' + type, callback);
	    }
	
	    /**
	     * takes the event and returns the key character
	     *
	     * @param {Event} e
	     * @return {string}
	     */
	    function _characterFromEvent(e) {
	
	        // for keypress events we should return the character as is
	        if (e.type == 'keypress') {
	            var character = String.fromCharCode(e.which);
	
	            // if the shift key is not pressed then it is safe to assume
	            // that we want the character to be lowercase.  this means if
	            // you accidentally have caps lock on then your key bindings
	            // will continue to work
	            //
	            // the only side effect that might not be desired is if you
	            // bind something like 'A' cause you want to trigger an
	            // event when capital A is pressed caps lock will no longer
	            // trigger the event.  shift+a will though.
	            if (!e.shiftKey) {
	                character = character.toLowerCase();
	            }
	
	            return character;
	        }
	
	        // for non keypress events the special maps are needed
	        if (_MAP[e.which]) {
	            return _MAP[e.which];
	        }
	
	        if (_KEYCODE_MAP[e.which]) {
	            return _KEYCODE_MAP[e.which];
	        }
	
	        // if it is not in the special map
	
	        // with keydown and keyup events the character seems to always
	        // come in as an uppercase character whether you are pressing shift
	        // or not.  we should make sure it is always lowercase for comparisons
	        return String.fromCharCode(e.which).toLowerCase();
	    }
	
	    /**
	     * checks if two arrays are equal
	     *
	     * @param {Array} modifiers1
	     * @param {Array} modifiers2
	     * @returns {boolean}
	     */
	    function _modifiersMatch(modifiers1, modifiers2) {
	        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
	    }
	
	    /**
	     * takes a key event and figures out what the modifiers are
	     *
	     * @param {Event} e
	     * @returns {Array}
	     */
	    function _eventModifiers(e) {
	        var modifiers = [];
	
	        if (e.shiftKey) {
	            modifiers.push('shift');
	        }
	
	        if (e.altKey) {
	            modifiers.push('alt');
	        }
	
	        if (e.ctrlKey) {
	            modifiers.push('ctrl');
	        }
	
	        if (e.metaKey) {
	            modifiers.push('meta');
	        }
	
	        return modifiers;
	    }
	
	    /**
	     * prevents default for this event
	     *
	     * @param {Event} e
	     * @returns void
	     */
	    function _preventDefault(e) {
	        if (e.preventDefault) {
	            e.preventDefault();
	            return;
	        }
	
	        e.returnValue = false;
	    }
	
	    /**
	     * stops propogation for this event
	     *
	     * @param {Event} e
	     * @returns void
	     */
	    function _stopPropagation(e) {
	        if (e.stopPropagation) {
	            e.stopPropagation();
	            return;
	        }
	
	        e.cancelBubble = true;
	    }
	
	    /**
	     * determines if the keycode specified is a modifier key or not
	     *
	     * @param {string} key
	     * @returns {boolean}
	     */
	    function _isModifier(key) {
	        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
	    }
	
	    /**
	     * reverses the map lookup so that we can look for specific keys
	     * to see what can and can't use keypress
	     *
	     * @return {Object}
	     */
	    function _getReverseMap() {
	        if (!_REVERSE_MAP) {
	            _REVERSE_MAP = {};
	            for (var key in _MAP) {
	
	                // pull out the numeric keypad from here cause keypress should
	                // be able to detect the keys from the character
	                if (key > 95 && key < 112) {
	                    continue;
	                }
	
	                if (_MAP.hasOwnProperty(key)) {
	                    _REVERSE_MAP[_MAP[key]] = key;
	                }
	            }
	        }
	        return _REVERSE_MAP;
	    }
	
	    /**
	     * picks the best action based on the key combination
	     *
	     * @param {string} key - character for key
	     * @param {Array} modifiers
	     * @param {string=} action passed in
	     */
	    function _pickBestAction(key, modifiers, action) {
	
	        // if no action was picked in we should try to pick the one
	        // that we think would work best for this key
	        if (!action) {
	            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
	        }
	
	        // modifier keys don't work as expected with keypress,
	        // switch to keydown
	        if (action == 'keypress' && modifiers.length) {
	            action = 'keydown';
	        }
	
	        return action;
	    }
	
	    /**
	     * Converts from a string key combination to an array
	     *
	     * @param  {string} combination like "command+shift+l"
	     * @return {Array}
	     */
	    function _keysFromString(combination) {
	        if (combination === '+') {
	            return ['+'];
	        }
	
	        combination = combination.replace(/\+{2}/g, '+plus');
	        return combination.split('+');
	    }
	
	    /**
	     * Gets info for a specific key combination
	     *
	     * @param  {string} combination key combination ("command+s" or "a" or "*")
	     * @param  {string=} action
	     * @returns {Object}
	     */
	    function _getKeyInfo(combination, action) {
	        var keys;
	        var key;
	        var i;
	        var modifiers = [];
	
	        // take the keys from this pattern and figure out what the actual
	        // pattern is all about
	        keys = _keysFromString(combination);
	
	        for (i = 0; i < keys.length; ++i) {
	            key = keys[i];
	
	            // normalize key names
	            if (_SPECIAL_ALIASES[key]) {
	                key = _SPECIAL_ALIASES[key];
	            }
	
	            // if this is not a keypress event then we should
	            // be smart about using shift keys
	            // this will only work for US keyboards however
	            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
	                key = _SHIFT_MAP[key];
	                modifiers.push('shift');
	            }
	
	            // if this key is a modifier then add it to the list of modifiers
	            if (_isModifier(key)) {
	                modifiers.push(key);
	            }
	        }
	
	        // depending on what the key combination is
	        // we will try to pick the best event for it
	        action = _pickBestAction(key, modifiers, action);
	
	        return {
	            key: key,
	            modifiers: modifiers,
	            action: action
	        };
	    }
	
	    function _belongsTo(element, ancestor) {
	        if (element === null || element === document) {
	            return false;
	        }
	
	        if (element === ancestor) {
	            return true;
	        }
	
	        return _belongsTo(element.parentNode, ancestor);
	    }
	
	    function Mousetrap(targetElement) {
	        var self = this;
	
	        targetElement = targetElement || document;
	
	        if (!(self instanceof Mousetrap)) {
	            return new Mousetrap(targetElement);
	        }
	
	        /**
	         * element to attach key events to
	         *
	         * @type {Element}
	         */
	        self.target = targetElement;
	
	        /**
	         * a list of all the callbacks setup via Mousetrap.bind()
	         *
	         * @type {Object}
	         */
	        self._callbacks = {};
	
	        /**
	         * direct map of string combinations to callbacks used for trigger()
	         *
	         * @type {Object}
	         */
	        self._directMap = {};
	
	        /**
	         * keeps track of what level each sequence is at since multiple
	         * sequences can start out with the same sequence
	         *
	         * @type {Object}
	         */
	        var _sequenceLevels = {};
	
	        /**
	         * variable to store the setTimeout call
	         *
	         * @type {null|number}
	         */
	        var _resetTimer;
	
	        /**
	         * temporary state where we will ignore the next keyup
	         *
	         * @type {boolean|string}
	         */
	        var _ignoreNextKeyup = false;
	
	        /**
	         * temporary state where we will ignore the next keypress
	         *
	         * @type {boolean}
	         */
	        var _ignoreNextKeypress = false;
	
	        /**
	         * are we currently inside of a sequence?
	         * type of action ("keyup" or "keydown" or "keypress") or false
	         *
	         * @type {boolean|string}
	         */
	        var _nextExpectedAction = false;
	
	        /**
	         * resets all sequence counters except for the ones passed in
	         *
	         * @param {Object} doNotReset
	         * @returns void
	         */
	        function _resetSequences(doNotReset) {
	            doNotReset = doNotReset || {};
	
	            var activeSequences = false,
	                key;
	
	            for (key in _sequenceLevels) {
	                if (doNotReset[key]) {
	                    activeSequences = true;
	                    continue;
	                }
	                _sequenceLevels[key] = 0;
	            }
	
	            if (!activeSequences) {
	                _nextExpectedAction = false;
	            }
	        }
	
	        /**
	         * finds all callbacks that match based on the keycode, modifiers,
	         * and action
	         *
	         * @param {string} character
	         * @param {Array} modifiers
	         * @param {Event|Object} e
	         * @param {string=} sequenceName - name of the sequence we are looking for
	         * @param {string=} combination
	         * @param {number=} level
	         * @returns {Array}
	         */
	        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
	            var i;
	            var callback;
	            var matches = [];
	            var action = e.type;
	
	            // if there are no events related to this keycode
	            if (!self._callbacks[character]) {
	                return [];
	            }
	
	            // if a modifier key is coming up on its own we should allow it
	            if (action == 'keyup' && _isModifier(character)) {
	                modifiers = [character];
	            }
	
	            // loop through all callbacks for the key that was pressed
	            // and see if any of them match
	            for (i = 0; i < self._callbacks[character].length; ++i) {
	                callback = self._callbacks[character][i];
	
	                // if a sequence name is not specified, but this is a sequence at
	                // the wrong level then move onto the next match
	                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
	                    continue;
	                }
	
	                // if the action we are looking for doesn't match the action we got
	                // then we should keep going
	                if (action != callback.action) {
	                    continue;
	                }
	
	                // if this is a keypress event and the meta key and control key
	                // are not pressed that means that we need to only look at the
	                // character, otherwise check the modifiers as well
	                //
	                // chrome will not fire a keypress if meta or control is down
	                // safari will fire a keypress if meta or meta+shift is down
	                // firefox will fire a keypress if meta or control is down
	                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {
	
	                    // when you bind a combination or sequence a second time it
	                    // should overwrite the first one.  if a sequenceName or
	                    // combination is specified in this call it does just that
	                    //
	                    // @todo make deleting its own method?
	                    var deleteCombo = !sequenceName && callback.combo == combination;
	                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
	                    if (deleteCombo || deleteSequence) {
	                        self._callbacks[character].splice(i, 1);
	                    }
	
	                    matches.push(callback);
	                }
	            }
	
	            return matches;
	        }
	
	        /**
	         * actually calls the callback function
	         *
	         * if your callback function returns false this will use the jquery
	         * convention - prevent default and stop propogation on the event
	         *
	         * @param {Function} callback
	         * @param {Event} e
	         * @returns void
	         */
	        function _fireCallback(callback, e, combo, sequence) {
	
	            // if this event should not happen stop here
	            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
	                return;
	            }
	
	            if (callback(e, combo) === false) {
	                _preventDefault(e);
	                _stopPropagation(e);
	            }
	        }
	
	        /**
	         * handles a character key event
	         *
	         * @param {string} character
	         * @param {Array} modifiers
	         * @param {Event} e
	         * @returns void
	         */
	        self._handleKey = function(character, modifiers, e) {
	            var callbacks = _getMatches(character, modifiers, e);
	            var i;
	            var doNotReset = {};
	            var maxLevel = 0;
	            var processedSequenceCallback = false;
	
	            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
	            for (i = 0; i < callbacks.length; ++i) {
	                if (callbacks[i].seq) {
	                    maxLevel = Math.max(maxLevel, callbacks[i].level);
	                }
	            }
	
	            // loop through matching callbacks for this key event
	            for (i = 0; i < callbacks.length; ++i) {
	
	                // fire for all sequence callbacks
	                // this is because if for example you have multiple sequences
	                // bound such as "g i" and "g t" they both need to fire the
	                // callback for matching g cause otherwise you can only ever
	                // match the first one
	                if (callbacks[i].seq) {
	
	                    // only fire callbacks for the maxLevel to prevent
	                    // subsequences from also firing
	                    //
	                    // for example 'a option b' should not cause 'option b' to fire
	                    // even though 'option b' is part of the other sequence
	                    //
	                    // any sequences that do not match here will be discarded
	                    // below by the _resetSequences call
	                    if (callbacks[i].level != maxLevel) {
	                        continue;
	                    }
	
	                    processedSequenceCallback = true;
	
	                    // keep a list of which sequences were matches for later
	                    doNotReset[callbacks[i].seq] = 1;
	                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
	                    continue;
	                }
	
	                // if there were no sequence matches but we are still here
	                // that means this is a regular match so we should fire that
	                if (!processedSequenceCallback) {
	                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
	                }
	            }
	
	            // if the key you pressed matches the type of sequence without
	            // being a modifier (ie "keyup" or "keypress") then we should
	            // reset all sequences that were not matched by this event
	            //
	            // this is so, for example, if you have the sequence "h a t" and you
	            // type "h e a r t" it does not match.  in this case the "e" will
	            // cause the sequence to reset
	            //
	            // modifier keys are ignored because you can have a sequence
	            // that contains modifiers such as "enter ctrl+space" and in most
	            // cases the modifier key will be pressed before the next key
	            //
	            // also if you have a sequence such as "ctrl+b a" then pressing the
	            // "b" key will trigger a "keypress" and a "keydown"
	            //
	            // the "keydown" is expected when there is a modifier, but the
	            // "keypress" ends up matching the _nextExpectedAction since it occurs
	            // after and that causes the sequence to reset
	            //
	            // we ignore keypresses in a sequence that directly follow a keydown
	            // for the same character
	            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
	            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
	                _resetSequences(doNotReset);
	            }
	
	            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
	        };
	
	        /**
	         * handles a keydown event
	         *
	         * @param {Event} e
	         * @returns void
	         */
	        function _handleKeyEvent(e) {
	
	            // normalize e.which for key events
	            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
	            if (typeof e.which !== 'number') {
	                e.which = e.keyCode;
	            }
	
	            var character = _characterFromEvent(e);
	
	            // no character found then stop
	            if (!character) {
	                return;
	            }
	
	            // need to use === for the character check because the character can be 0
	            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
	                _ignoreNextKeyup = false;
	                return;
	            }
	
	            self.handleKey(character, _eventModifiers(e), e);
	        }
	
	        /**
	         * called to set a 1 second timeout on the specified sequence
	         *
	         * this is so after each key press in the sequence you have 1 second
	         * to press the next key before you have to start over
	         *
	         * @returns void
	         */
	        function _resetSequenceTimer() {
	            clearTimeout(_resetTimer);
	            _resetTimer = setTimeout(_resetSequences, 1000);
	        }
	
	        /**
	         * binds a key sequence to an event
	         *
	         * @param {string} combo - combo specified in bind call
	         * @param {Array} keys
	         * @param {Function} callback
	         * @param {string=} action
	         * @returns void
	         */
	        function _bindSequence(combo, keys, callback, action) {
	
	            // start off by adding a sequence level record for this combination
	            // and setting the level to 0
	            _sequenceLevels[combo] = 0;
	
	            /**
	             * callback to increase the sequence level for this sequence and reset
	             * all other sequences that were active
	             *
	             * @param {string} nextAction
	             * @returns {Function}
	             */
	            function _increaseSequence(nextAction) {
	                return function() {
	                    _nextExpectedAction = nextAction;
	                    ++_sequenceLevels[combo];
	                    _resetSequenceTimer();
	                };
	            }
	
	            /**
	             * wraps the specified callback inside of another function in order
	             * to reset all sequence counters as soon as this sequence is done
	             *
	             * @param {Event} e
	             * @returns void
	             */
	            function _callbackAndReset(e) {
	                _fireCallback(callback, e, combo);
	
	                // we should ignore the next key up if the action is key down
	                // or keypress.  this is so if you finish a sequence and
	                // release the key the final key will not trigger a keyup
	                if (action !== 'keyup') {
	                    _ignoreNextKeyup = _characterFromEvent(e);
	                }
	
	                // weird race condition if a sequence ends with the key
	                // another sequence begins with
	                setTimeout(_resetSequences, 10);
	            }
	
	            // loop through keys one at a time and bind the appropriate callback
	            // function.  for any key leading up to the final one it should
	            // increase the sequence. after the final, it should reset all sequences
	            //
	            // if an action is specified in the original bind call then that will
	            // be used throughout.  otherwise we will pass the action that the
	            // next key in the sequence should match.  this allows a sequence
	            // to mix and match keypress and keydown events depending on which
	            // ones are better suited to the key provided
	            for (var i = 0; i < keys.length; ++i) {
	                var isFinal = i + 1 === keys.length;
	                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
	                _bindSingle(keys[i], wrappedCallback, action, combo, i);
	            }
	        }
	
	        /**
	         * binds a single keyboard combination
	         *
	         * @param {string} combination
	         * @param {Function} callback
	         * @param {string=} action
	         * @param {string=} sequenceName - name of sequence if part of sequence
	         * @param {number=} level - what part of the sequence the command is
	         * @returns void
	         */
	        function _bindSingle(combination, callback, action, sequenceName, level) {
	
	            // store a direct mapped reference for use with Mousetrap.trigger
	            self._directMap[combination + ':' + action] = callback;
	
	            // make sure multiple spaces in a row become a single space
	            combination = combination.replace(/\s+/g, ' ');
	
	            var sequence = combination.split(' ');
	            var info;
	
	            // if this pattern is a sequence of keys then run through this method
	            // to reprocess each pattern one key at a time
	            if (sequence.length > 1) {
	                _bindSequence(combination, sequence, callback, action);
	                return;
	            }
	
	            info = _getKeyInfo(combination, action);
	
	            // make sure to initialize array if this is the first time
	            // a callback is added for this key
	            self._callbacks[info.key] = self._callbacks[info.key] || [];
	
	            // remove an existing match if there is one
	            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);
	
	            // add this call back to the array
	            // if it is a sequence put it at the beginning
	            // if not put it at the end
	            //
	            // this is important because the way these are processed expects
	            // the sequence ones to come first
	            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
	                callback: callback,
	                modifiers: info.modifiers,
	                action: info.action,
	                seq: sequenceName,
	                level: level,
	                combo: combination
	            });
	        }
	
	        /**
	         * binds multiple combinations to the same callback
	         *
	         * @param {Array} combinations
	         * @param {Function} callback
	         * @param {string|undefined} action
	         * @returns void
	         */
	        self._bindMultiple = function(combinations, callback, action) {
	            for (var i = 0; i < combinations.length; ++i) {
	                _bindSingle(combinations[i], callback, action);
	            }
	        };
	
	        // start!
	        _addEvent(targetElement, 'keypress', _handleKeyEvent);
	        _addEvent(targetElement, 'keydown', _handleKeyEvent);
	        _addEvent(targetElement, 'keyup', _handleKeyEvent);
	    }
	
	    /**
	     * binds an event to mousetrap
	     *
	     * can be a single key, a combination of keys separated with +,
	     * an array of keys, or a sequence of keys separated by spaces
	     *
	     * be sure to list the modifier keys first to make sure that the
	     * correct key ends up getting bound (the last key in the pattern)
	     *
	     * @param {string|Array} keys
	     * @param {Function} callback
	     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
	     * @returns void
	     */
	    Mousetrap.prototype.bind = function(keys, callback, action) {
	        var self = this;
	        keys = keys instanceof Array ? keys : [keys];
	        self._bindMultiple.call(self, keys, callback, action);
	        return self;
	    };
	
	    /**
	     * unbinds an event to mousetrap
	     *
	     * the unbinding sets the callback function of the specified key combo
	     * to an empty function and deletes the corresponding key in the
	     * _directMap dict.
	     *
	     * TODO: actually remove this from the _callbacks dictionary instead
	     * of binding an empty function
	     *
	     * the keycombo+action has to be exactly the same as
	     * it was defined in the bind method
	     *
	     * @param {string|Array} keys
	     * @param {string} action
	     * @returns void
	     */
	    Mousetrap.prototype.unbind = function(keys, action) {
	        var self = this;
	        return self.bind.call(self, keys, function() {}, action);
	    };
	
	    /**
	     * triggers an event that has already been bound
	     *
	     * @param {string} keys
	     * @param {string=} action
	     * @returns void
	     */
	    Mousetrap.prototype.trigger = function(keys, action) {
	        var self = this;
	        if (self._directMap[keys + ':' + action]) {
	            self._directMap[keys + ':' + action]({}, keys);
	        }
	        return self;
	    };
	
	    /**
	     * resets the library back to its initial state.  this is useful
	     * if you want to clear out the current keyboard shortcuts and bind
	     * new ones - for example if you switch to another page
	     *
	     * @returns void
	     */
	    Mousetrap.prototype.reset = function() {
	        var self = this;
	        self._callbacks = {};
	        self._directMap = {};
	        return self;
	    };
	
	    /**
	     * should we stop this event before firing off callbacks
	     *
	     * @param {Event} e
	     * @param {Element} element
	     * @return {boolean}
	     */
	    Mousetrap.prototype.stopCallback = function(e, element) {
	        var self = this;
	
	        // if the element has the class "mousetrap" then no need to stop
	        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
	            return false;
	        }
	
	        if (_belongsTo(element, self.target)) {
	            return false;
	        }
	
	        // stop for input, select, and textarea
	        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
	    };
	
	    /**
	     * exposes _handleKey publicly so it can be overwritten by extensions
	     */
	    Mousetrap.prototype.handleKey = function() {
	        var self = this;
	        return self._handleKey.apply(self, arguments);
	    };
	
	    /**
	     * allow custom key mappings
	     */
	    Mousetrap.addKeycodes = function(object) {
	        for (var key in object) {
	            if (object.hasOwnProperty(key)) {
	                _MAP[key] = object[key];
	            }
	        }
	        _REVERSE_MAP = null;
	    };
	
	    /**
	     * Init the global mousetrap functions
	     *
	     * This method is needed to allow the global mousetrap functions to work
	     * now that mousetrap is a constructor function.
	     */
	    Mousetrap.init = function() {
	        var documentMousetrap = Mousetrap(document);
	        for (var method in documentMousetrap) {
	            if (method.charAt(0) !== '_') {
	                Mousetrap[method] = (function(method) {
	                    return function() {
	                        return documentMousetrap[method].apply(documentMousetrap, arguments);
	                    };
	                } (method));
	            }
	        }
	    };
	
	    Mousetrap.init();
	
	    // expose mousetrap to the global object
	    window.Mousetrap = Mousetrap;
	
	    // expose as a common js module
	    if (typeof module !== 'undefined' && module.exports) {
	        module.exports = Mousetrap;
	    }
	
	    // expose mousetrap as an AMD module
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Mousetrap;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);


/***/ },
/* 5 */
/*!*************************!*\
  !*** external "clappr" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=clappr-playback-control-plugin.js.map