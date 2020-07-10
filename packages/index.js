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
/******/ 	return __webpack_require__(__webpack_require__.s = 79);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var getOwnPropertyDescriptor = __webpack_require__(38).f;
var createNonEnumerableProperty = __webpack_require__(10);
var redefine = __webpack_require__(11);
var setGlobal = __webpack_require__(58);
var copyConstructorProperties = __webpack_require__(82);
var isForced = __webpack_require__(85);

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var shared = __webpack_require__(60);
var has = __webpack_require__(5);
var uid = __webpack_require__(61);
var NATIVE_SYMBOL = __webpack_require__(67);
var USE_SYMBOL_AS_UID = __webpack_require__(87);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(125)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var IE8_DOM_DEFINE = __webpack_require__(80);
var anObject = __webpack_require__(4);
var toPrimitive = __webpack_require__(27);

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(16);

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var definePropertyModule = __webpack_require__(8);
var createPropertyDescriptor = __webpack_require__(20);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var createNonEnumerableProperty = __webpack_require__(10);
var has = __webpack_require__(5);
var setGlobal = __webpack_require__(58);
var inspectSource = __webpack_require__(59);
var InternalStateModule = __webpack_require__(17);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(42);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(39);
var requireObjectCoercible = __webpack_require__(16);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var fails = __webpack_require__(2);
var has = __webpack_require__(5);

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

module.exports = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !DESCRIPTORS) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(126);
var global = __webpack_require__(3);
var isObject = __webpack_require__(6);
var createNonEnumerableProperty = __webpack_require__(10);
var objectHas = __webpack_require__(5);
var sharedKey = __webpack_require__(40);
var hiddenKeys = __webpack_require__(41);

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(83);
var global = __webpack_require__(3);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var forEach = __webpack_require__(86);

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(13);
var addToUnscopables = __webpack_require__(46);
var Iterators = __webpack_require__(31);
var InternalStateModule = __webpack_require__(17);
var defineIterator = __webpack_require__(90);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(8).f;
var has = __webpack_require__(5);
var wellKnownSymbol = __webpack_require__(1);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);

__webpack_require__(26);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = /*#__PURE__*/function () {
  "use strict";

  function Tile() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Tile);

    this.type = config.type; //Ex. wind, bamboo, character, pretty, dragon

    this.value = config.value; //Ex. 1,3 red, west

    if (config.faceDown) {
      this.faceDown = true;
      this.imageUrl = "assets/tiles/face-down.png";
    } else {
      this.imageUrl = "assets/tiles/" + this.type + "s" + "/" + this.value + ".png";
    }

    this.matches = function (tile) {
      if (this.faceDown) {
        return false;
      }

      if (tile.type === this.type && tile.value === this.value) {
        return true;
      }

      return false;
    };

    this.isDouble = function (userWind) {
      return 0;
    };

    this.getPoints = function () {
      return 0;
    };

    this.toJSON = function () {
      var obj = {};
      obj.class = "Tile";
      obj.type = this.type;
      obj.value = this.value;

      if (this.faceDown) {
        obj.faceDown = this.faceDown;
      }

      return JSON.stringify(obj);
    }.bind(this);

    this.isSequence = false;
    this.isPongOrKong = false;
    this.isPair = false;
  }

  _createClass(Tile, null, [{
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Tile") {
        throw "String was not created by Tile.toJSON()";
      }

      return new Tile(obj);
    }
  }]);

  return Tile;
}();

module.exports = Tile;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var fails = __webpack_require__(2);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(27);

var FORCED = fails(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tojson
$({ target: 'Date', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return URL.prototype.toString.call(this);
  }
});


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(29);
var IndexedObject = __webpack_require__(39);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(12);
var arraySpeciesCreate = __webpack_require__(66);

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(30);

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(70).charAt;
var InternalStateModule = __webpack_require__(17);
var defineIterator = __webpack_require__(90);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);
var wellKnownSymbol = __webpack_require__(1);
var V8_VERSION = __webpack_require__(74);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var exec = __webpack_require__(53);

$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var DOMIterables = __webpack_require__(96);
var forEach = __webpack_require__(86);
var createNonEnumerableProperty = __webpack_require__(10);

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var $includes = __webpack_require__(63).includes;
var addToUnscopables = __webpack_require__(46);
var arrayMethodUsesToLength = __webpack_require__(15);

var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: !USES_TO_LENGTH }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var $map = __webpack_require__(28).map;
var arrayMethodHasSpeciesSupport = __webpack_require__(33);
var arrayMethodUsesToLength = __webpack_require__(15);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var propertyIsEnumerableModule = __webpack_require__(56);
var createPropertyDescriptor = __webpack_require__(20);
var toIndexedObject = __webpack_require__(13);
var toPrimitive = __webpack_require__(27);
var has = __webpack_require__(5);
var IE8_DOM_DEFINE = __webpack_require__(80);

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);
var classof = __webpack_require__(14);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(60);
var uid = __webpack_require__(61);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(42);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(14);

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(2);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(1);
var create = __webpack_require__(47);
var definePropertyModule = __webpack_require__(8);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var defineProperties = __webpack_require__(88);
var enumBugKeys = __webpack_require__(64);
var hiddenKeys = __webpack_require__(41);
var html = __webpack_require__(89);
var documentCreateElement = __webpack_require__(57);
var sharedKey = __webpack_require__(40);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(84);
var enumBugKeys = __webpack_require__(64);

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(68);
var redefine = __webpack_require__(11);
var toString = __webpack_require__(131);

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var DOMIterables = __webpack_require__(96);
var ArrayIteratorMethods = __webpack_require__(22);
var createNonEnumerableProperty = __webpack_require__(10);
var wellKnownSymbol = __webpack_require__(1);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(27);
var definePropertyModule = __webpack_require__(8);
var createPropertyDescriptor = __webpack_require__(20);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(69);
var Iterators = __webpack_require__(31);
var wellKnownSymbol = __webpack_require__(1);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__(95);
var stickyHelpers = __webpack_require__(144);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(160);

__webpack_require__(36);

__webpack_require__(37);

__webpack_require__(25);

__webpack_require__(26);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(24);

var Match = /*#__PURE__*/function () {
  "use strict";

  function Match() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Match);

    if (config.exposed == undefined) {
      throw "Must specify either true or false for config.exposed. ";
    }

    if (config.amount < 2 || config.amount > 4) {
      throw "config.mount must be either 2, 3, or 4. ";
    }

    this.type = config.type;
    this.value = config.value;
    this.amount = config.amount;
    this.exposed = config.exposed;

    this.getComponentTile = function () {
      return new Tile({
        type: this.type,
        value: this.value
      });
    };

    this.getPoints = function (userWind) {
      var points = 0;

      if (["bamboo", "character", "circle"].includes(this.type)) {
        points = 2;

        if (this.value === 1 || this.value === 9) {
          points *= 2;

          if (this.amount === 2) {
            return 2;
          } //This is a pair. It's worth 2 points

        }

        if (this.amount === 2) {
          return 0;
        } //Worthless pair

      } else {
        points = 4; //Either wind or dragon. 4 points for pong.

        if (this.amount === 2) {
          if (this.type === "wind" && this.value !== userWind) {
            return 0;
          } //Not own wind. Worthless pair.


          return 2; //2 points for pair.
        }
      }

      if (this.amount === 4) {
        points *= 4;
      } //Kongs worth 4 times as much as pongs.


      if (!this.exposed) {
        points *= 2;
      } //In hand worth 4 times as much.


      return points;
    };

    this.isDouble = function (userWind) {
      if (this.amount === 2) {
        return false;
      } //Pairs never give doubles.


      if (this.type === "dragon") {
        return true;
      }

      if (this.type === "wind" && this.value === userWind) {
        return true;
      }

      return false;
    };

    Object.defineProperty(this, "tiles", {
      get: function getTiles() {
        var _this = this;

        return new Array(this.amount).fill(0).map(function () {
          return _this.getComponentTile();
        }.bind(this));
      }.bind(this)
    });
    Object.defineProperty(this, "isPair", {
      get: function isPair() {
        if (this.amount === 2) {
          return true;
        }

        return false;
      }
    });
    Object.defineProperty(this, "isPongOrKong", {
      get: function isPongOrKong() {
        if (this.amount >= 3) {
          return true;
        }

        return false;
      }
    });

    this.toJSON = function () {
      var obj = {};
      obj.class = "Match";
      obj.type = this.type;
      obj.value = this.value;
      obj.amount = this.amount;
      obj.exposed = this.exposed;
      return JSON.stringify(obj);
    }.bind(this);

    this.isSequence = false;
  }

  _createClass(Match, null, [{
    key: "isValidMatch",
    value: function isValidMatch(tiles) {
      //Confirm that the tiles all match.
      //Note that if two tiles are equal, that means they are the same tile, just referenced twice. That is not a valid match, however we currently do not check for that.
      for (var i = 0; i < tiles.length; i++) {
        if (!tiles[0].matches(tiles[i])) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Match") {
        throw "String was not created by Match.toJSON()";
      }

      return new Match(obj);
    }
  }]);

  return Match;
}();

module.exports = Match;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36);

__webpack_require__(37);

__webpack_require__(120);

__webpack_require__(25);

__webpack_require__(26);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(24);

var Sequence = /*#__PURE__*/function () {
  "use strict";

  function Sequence() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Sequence);

    if (config.exposed === undefined) {
      throw "config.exposed must not be undefined. ";
    }

    this.isDouble = function (userWind) {
      return false;
    };

    this.getPoints = function () {
      return 0;
    };

    if (!config.tiles instanceof Array) {
      throw "config.tiles must be an array of Tiles";
    }

    if (!Sequence.isValidSequence(config.tiles)) {
      throw "config.tiles is not a valid sequence. ";
    }

    this.tiles = config.tiles; //Sort the sequence.

    this.tiles = this.tiles.sort(function (tile1, tile2) {
      return tile1.value - tile2.value;
    });
    this.exposed = config.exposed;
    this.isSequence = true;
    this.isPongOrKong = false;
    this.isPair = false;

    this.toJSON = function () {
      var obj = {};
      obj.class = "Sequence";
      obj.exposed = this.exposed;
      obj.tiles = this.tiles;
      return JSON.stringify(obj);
    }.bind(this);
  }

  _createClass(Sequence, null, [{
    key: "isValidSequence",
    value: function isValidSequence(tiles) {
      var type = tiles[0].type;
      var values = [];

      if (!["bamboo", "character", "circle"].includes(type)) {
        return false;
      } //Sort the sequence.


      tiles = tiles.sort(function (tile1, tile2) {
        return tile1.value - tile2.value;
      });

      for (var i = 1; i < tiles.length; i++) {
        var tile = tiles[i];

        if (tile.type !== type) {
          return false;
        } //Tiles are not the same suit.


        if (Math.abs(tiles[i - 1].value - tile.value) !== 1) {
          return false;
        } //Tiles are not in a sequence. There is a difference between the values that is not 1.

      }

      return true;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Sequence") {
        throw "String was not created by Sequence.toJSON()";
      }

      obj.tiles = obj.tiles.map(function (tileString) {
        return Tile.fromJSON(tileString);
      });
      return new Sequence(obj);
    }
  }]);

  return Sequence;
}();

module.exports = Sequence;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var isObject = __webpack_require__(6);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var createNonEnumerableProperty = __webpack_require__(10);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(81);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(21);
var store = __webpack_require__(81);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.5',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 61 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(84);
var enumBugKeys = __webpack_require__(64);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(13);
var toLength = __webpack_require__(12);
var toAbsoluteIndex = __webpack_require__(43);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 65 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var isArray = __webpack_require__(44);
var wellKnownSymbol = __webpack_require__(1);

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(1);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(68);
var classofRaw = __webpack_require__(14);
var wellKnownSymbol = __webpack_require__(1);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(42);
var requireObjectCoercible = __webpack_require__(16);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(32);
var $ = __webpack_require__(0);
var DESCRIPTORS = __webpack_require__(7);
var USE_NATIVE_URL = __webpack_require__(97);
var global = __webpack_require__(3);
var defineProperties = __webpack_require__(88);
var redefine = __webpack_require__(11);
var anInstance = __webpack_require__(72);
var has = __webpack_require__(5);
var assign = __webpack_require__(132);
var arrayFrom = __webpack_require__(98);
var codeAt = __webpack_require__(70).codeAt;
var toASCII = __webpack_require__(133);
var setToStringTag = __webpack_require__(23);
var URLSearchParamsModule = __webpack_require__(134);
var InternalStateModule = __webpack_require__(17);

var NativeURL = global.URL;
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
// eslint-disable-next-line no-control-regex
var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = toASCII(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!DESCRIPTORS) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(19);

__webpack_require__(22);

__webpack_require__(102);

__webpack_require__(49);

__webpack_require__(136);

__webpack_require__(34);

__webpack_require__(32);

__webpack_require__(109);

__webpack_require__(35);

__webpack_require__(50);

__webpack_require__(71);

__webpack_require__(112);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StateManager = /*#__PURE__*/function () {
  "use strict";

  function StateManager(websocketURL) {
    _classCallCheck(this, StateManager);

    //This function is referenced in createWebsocket, so DO NOT move it downwards. You will get burned by a lack of function hoisting.
    var onmessage = function onmessage(message) {
      var obj = JSON.parse(message.data);
      console.log(obj);

      if (obj.type === "joinRoom") {
        onJoinRoom(obj);
      } else if (obj.type === "createRoom") {
        onCreateRoom(obj);
      } else if (obj.type === "roomActionState") {
        onStateUpdate(obj);
      } else if (obj.type === "roomActionKickFromRoom") {//We kicked somebody else. Should probably show an error message or success.
      } else if (obj.type === "roomActionLeaveRoom") {
        onLeaveRoom(obj);
      } else if (obj.type === "getCurrentRoom") {
        onGetCurrentRoom(obj);
      } else if (obj.type === "roomActionStartGame") {
        onStartGame(obj);
      } else if (obj.type === "roomActionEndGame") {
        onEndGame(obj);
      } else if (obj.type === "roomActionMahjong") {
        if (this.onGameMahjong instanceof Function) {
          this.onGameMahjong(obj);
        }
      } else if (obj.type === "roomActionPlaceTiles") {
        if (this.onPlaceTiles instanceof Function) {
          this.onPlaceTiles(obj);
        }
      } else {
        console.log("Unknown Type " + obj.type);
      }
    }.bind(this);

    this.createWebsocket = /*#__PURE__*/function () {
      var _createWebsocket = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.websocket = new WebSocket(websocketURL);
                this.websocket.addEventListener("message", onmessage);
                this.websocket.addEventListener("error", /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            console.error(e);
                            this.createWebsocket();
                            this.getCurrentRoom(); //Syncs state.

                          case 3:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));

                  return function (_x) {
                    return _ref.apply(this, arguments);
                  };
                }().bind(this));
                this.websocket.addEventListener("close", /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            console.warn(e);

                            if (!(e.code !== 1000)) {
                              _context2.next = 6;
                              break;
                            }

                            _context2.next = 4;
                            return new Promise(function (resolve, reject) {
                              setTimeout(resolve, 2000);
                            });

                          case 4:
                            //2 second delay on reconnects. Don't want to send out 100s of requests per second when something goes wrong.
                            this.createWebsocket();
                            this.getCurrentRoom(); //Syncs state.

                          case 6:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }().bind(this));

                this.sendMessage = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
                    var _this = this;

                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!(this.websocket.readyState === 0)) {
                              _context3.next = 3;
                              break;
                            }

                            _context3.next = 3;
                            return new Promise(function (resolve, reject) {
                              _this.websocket.onopen = resolve;
                              _this.websocket.onerror = reject; //TODO: Handle error.
                            });

                          case 3:
                            console.log(message);
                            this.websocket.send(message);

                          case 5:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  return function (_x3) {
                    return _ref3.apply(this, arguments);
                  };
                }();

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createWebsocket() {
        return _createWebsocket.apply(this, arguments);
      }

      return createWebsocket;
    }().bind(this);

    this.createWebsocket();
    this.inRoom = false;
    this.isHost = false;
    this.inGame = false;

    this.joinRoom = function (roomId, nickname) {
      this.sendMessage(JSON.stringify({
        type: "joinRoom",
        clientId: window.clientId,
        roomId: roomId,
        nickname: nickname
      }));
    };

    this.createRoom = function (roomId, nickname) {
      this.sendMessage(JSON.stringify({
        type: "createRoom",
        clientId: window.clientId,
        roomId: roomId,
        nickname: nickname
      }));
    };

    this.kickUser = function (roomId, userId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionKickFromRoom",
        clientId: window.clientId,
        roomId: roomId,
        id: userId ///id of user to kick.

      }));
    };

    this.leaveRoom = function (roomId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionLeaveRoom",
        clientId: window.clientId,
        roomId: roomId
      }));
    };

    this.closeRoom = function (roomId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionCloseRoom",
        clientId: window.clientId,
        roomId: roomId
      }));
    };

    this.startGame = function (roomId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionStartGame",
        clientId: window.clientId,
        roomId: roomId
      }));
    };

    this.endGame = function () {
      this.sendMessage(JSON.stringify({
        type: "roomActionEndGame",
        clientId: window.clientId,
        roomId: window.stateManager.roomId
      }));
    };

    this.placeTiles = function (tiles) {
      var mahjong = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.sendMessage(JSON.stringify({
        type: "roomActionPlaceTiles",
        clientId: window.clientId,
        roomId: window.stateManager.roomId,
        mahjong: mahjong,
        message: tiles
      }));
    };

    this.nextTurn = function () {
      this.sendMessage(JSON.stringify({
        type: "roomActionNextTurn",
        clientId: window.clientId,
        roomId: window.stateManager.roomId
      }));
    };

    this.getCurrentRoom = function () {
      //Get our room.
      this.sendMessage(JSON.stringify({
        "type": "getCurrentRoom",
        clientId: window.clientId
      }));
    }.bind(this);

    this.getState = function (roomId) {
      console.log("Getting state...");
      this.sendMessage(JSON.stringify({
        type: "roomActionState",
        clientId: window.clientId,
        roomId: roomId
      }));
    };

    var onCreateRoom = function onCreateRoom(obj) {
      if (obj.status === "success") {
        this.inRoom = obj.message;
        this.isHost = true;
      }

      if (this.onCreateRoom instanceof Function) {
        this.onCreateRoom(obj);
      }
    }.bind(this);

    var onJoinRoom = function onJoinRoom(obj) {
      if (obj.status === "success") {
        this.inRoom = obj.message;
      }

      if (this.onJoinRoom instanceof Function) {
        this.onJoinRoom(obj);
      }
    }.bind(this);

    var onLeaveRoom = function onLeaveRoom(obj) {
      if (obj.status === "success") {
        this.inRoom = false;
        this.isHost = false;
      }

      if (this.onLeaveRoom instanceof Function) {
        this.onLeaveRoom(obj);
      }
    }.bind(this); //We'll allow multiple listeners for some events.


    var listeners = {
      onStartGame: [],
      onEndGame: [],
      onStateUpdate: []
    };

    this.addEventListener = function addEventListener(type, listener) {
      if (!listeners[type]) {
        throw type + " is not supported by this addEventListener";
      }

      listeners[type].push(listener);
    }.bind(this);

    this.removeEventListener = function addEventListener(type, listener) {
      if (!listeners[type]) {
        throw type + " is not supported by this addEventListener";
      }

      if (listeners.indexOf(listener) === -1) {
        throw "Unable to find listener";
      }

      listeners[type].splice(listeners.indexOf(listener), 1);
    }.bind(this);

    var onStartGame = function onStartGame(obj) {
      if (obj.status === "success") {
        this.inGame = true;
      }

      if (this.onStartGame instanceof Function) {
        this.onStartGame(obj);
      }

      listeners.onStartGame.forEach(function (listener) {
        listener(obj);
      });
    }.bind(this);

    var onEndGame = function onEndGame(obj) {
      if (obj.status === "success") {
        this.inGame = false;
      }

      if (this.onEndGame instanceof Function) {
        this.onEndGame(obj);
      }

      listeners.onEndGame.forEach(function (listener) {
        listener(obj);
      });
    }.bind(this);

    var onStateUpdate = function onStateUpdate(obj) {
      console.log(obj);
      this.isHost = obj.message.isHost;

      if (this.inGame === false && obj.message.inGame === true) {
        onStartGame({
          status: "success",
          message: "State Sync"
        });
      } else if (this.inGame === true && obj.message.inGame === false) {
        onEndGame({
          status: "success",
          message: "State Sync"
        });
      }

      this.currentTurn = obj.message.currentTurn;

      if (this.onStateUpdate instanceof Function) {
        this.onStateUpdate(obj);
      }

      listeners.onStateUpdate.forEach(function (listener) {
        listener(obj);
      });
    }.bind(this);

    var onGetCurrentRoom = function onGetCurrentRoom(obj) {
      console.log(obj);
      this.inRoom = obj.message || false; //Now, if we are in a room, we should sync state with the room.

      if (this.inRoom) {
        onJoinRoom(obj);
        this.getState(this.inRoom);
      }
    }.bind(this);
  }

  _createClass(StateManager, null, [{
    key: "setClientId",
    value: function setClientId(newId) {
      window.clientId = newId;
      localStorage.setItem("clientId", window.clientId); //Development use only. Warnings should be shown.
      //This will only change the clientId for the session. It will not change localStorage.

      var params = new URLSearchParams(window.location.search);

      if (params.has("clientId")) {
        window.clientId = params.get("clientId");
      }
    }
  }, {
    key: "createNewClientId",
    value: function createNewClientId() {
      return "user" + Math.random() * Math.pow(2, 53);
    }
  }, {
    key: "getClientId",
    value: function getClientId() {
      //Get the users clientId, or create a new one.
      var clientId = localStorage.getItem("clientId");

      if (clientId === null) {
        clientId = StateManager.createNewClientId();
      }

      return clientId;
    }
  }]);

  return StateManager;
}();

StateManager.setClientId(StateManager.getClientId());
module.exports = StateManager;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var userAgent = __webpack_require__(103);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var fails = __webpack_require__(2);
var isArray = __webpack_require__(44);
var isObject = __webpack_require__(6);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(12);
var createProperty = __webpack_require__(51);
var arraySpeciesCreate = __webpack_require__(66);
var arrayMethodHasSpeciesSupport = __webpack_require__(33);
var wellKnownSymbol = __webpack_require__(1);
var V8_VERSION = __webpack_require__(74);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36);

__webpack_require__(25);

__webpack_require__(26);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pretty = /*#__PURE__*/function () {
  "use strict";

  function Pretty() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Pretty);

    if (!["season", "flower"].includes(config.seasonOrFlower)) {
      throw "config.seasorOrFlower must either be 'season' or 'flower'";
    }

    this.type = "pretty";
    this.value = config.value;
    this.seasonOrFlower = config.seasonOrFlower;
    this.exposed = true;
    var numberToWind = ["east", "south", "west", "north"];

    this.isDouble = function (userWind) {
      if (userWind === numberToWind[this.value - 1]) {
        return true;
      }

      return false;
    };

    this.getPoints = function () {
      return 4;
    };

    this.imageUrl = "assets/tiles/" + config.seasonOrFlower + "s" + "/" + config.value + ".png";

    this.toJSON = function () {
      var obj = {};
      obj.class = "Pretty";
      obj.value = this.value;
      obj.seasonOrFlower = this.seasonOrFlower;
      return JSON.stringify(obj);
    }.bind(this);

    this.isSequence = false;
    this.isPongOrKong = false;
    this.isPair = false;
  }

  _createClass(Pretty, null, [{
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Pretty") {
        throw "String was not created by Pretty.toJSON()";
      }

      return new Pretty(obj);
    }
  }]);

  return Pretty;
}();

module.exports = Pretty;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(75);

__webpack_require__(19);

__webpack_require__(37);

__webpack_require__(25);

__webpack_require__(34);

__webpack_require__(121);

__webpack_require__(35);

__webpack_require__(26);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(24);

var Pretty = __webpack_require__(76);

var Wall = /*#__PURE__*/function () {
  "use strict";

  function Wall(tiles) {
    var _this = this;

    _classCallCheck(this, Wall);

    this.drawFirst = function () {
      return this.tiles.pop();
    };

    this.drawLast = function () {
      return this.tiles.shift();
    };

    if (tiles) {
      this.tiles = tiles;
    } else {
      this.tiles = []; //Time to add the tiles to the deck...

      this.tiles = this.tiles.concat(Wall.getNonPrettyTiles());
      [false, true].forEach(function (isSeason) {
        for (var i = 1; i <= 4; i++) {
          _this.tiles.push(new Pretty({
            value: i,
            seasonOrFlower: isSeason ? "season" : "flower"
          }));
        }
      }); //Randomly mix the tiles.

      Wall.shuffleArray(this.tiles);
    }

    this.toJSON = function () {
      return JSON.stringify(this.tiles);
    }.bind(this);
  }

  _createClass(Wall, null, [{
    key: "getNonPrettyTiles",
    value: function getNonPrettyTiles() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
      //We have this as a static method because it can be useful to obtain a copy of every playing tiles in the game.
      var tiles = [];

      var _loop = function _loop(i) {
        for (var c = 0; c < amount; c++) {
          ["bamboo", "character", "circle"].forEach(function (type) {
            tiles.push(new Tile({
              type: type,
              value: i
            }));
          });
        }
      };

      for (var i = 1; i <= 9; i++) {
        _loop(i);
      }

      ;
      ["red", "green", "white"].forEach(function (value) {
        for (var _i = 0; _i < amount; _i++) {
          tiles.push(new Tile({
            type: "dragon",
            value: value
          }));
        }
      });
      ["north", "south", "east", "west"].forEach(function (value) {
        for (var _i2 = 0; _i2 < amount; _i2++) {
          tiles.push(new Tile({
            type: "wind",
            value: value
          }));
        }
      });
      return tiles;
    }
  }, {
    key: "shuffleArray",
    value: function shuffleArray(array) {
      //Durstenfeld shuffle
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [array[j], array[i]];
        array[i] = _ref[0];
        array[j] = _ref[1];
      }
    }
  }, {
    key: "renderWall",
    value: function renderWall(div, tilesRemaining) {
      while (div.firstChild) {
        div.firstChild.remove();
      } //Delete any existing tiles.


      for (var i = 0; i < tilesRemaining; i++) {
        var tile = document.createElement("img");
        tile.src = "assets/tiles/face-down.png";
        div.appendChild(tile);
      }

      if (tilesRemaining === 0) {
        return;
      } //Don't write "0" to the screen.
      //Write the number of tiles that remain.


      var digits = String(tilesRemaining).split("");
      digits.forEach(function (digit) {
        var elem = document.createElement("p");
        elem.innerHTML = digit;
        div.appendChild(elem);
      });
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var tiles = JSON.parse(str);
      tiles = tiles.map(function (tileString) {
        var obj = JSON.parse(tileString);

        if (obj.class === "Pretty") {
          return Pretty.fromJSON(tileString);
        } else if (obj.class === "Tile") {
          return Tile.fromJSON(tileString);
        } else {
          throw "Unable to identify tileString " + tileString;
        }
      });
      return new Wall(tiles);
    }
  }]);

  return Wall;
}();

module.exports = Wall;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(163);

__webpack_require__(34);

__webpack_require__(121);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notification = function Notification(errorText, messageText) {
  "use strict";

  _classCallCheck(this, Notification);

  messageText = messageText.split("\n").join("<br>");
  var cover = document.createElement("div");
  cover.id = "errorPopupCover";
  cover.style.display = "none";
  document.body.appendChild(cover);
  var popup = document.createElement("div");
  popup.id = "errorPopup";
  cover.appendChild(popup);
  var error = document.createElement("p");
  error.innerHTML = errorText;
  error.id = "errorText";
  popup.appendChild(error);
  var message = document.createElement("p");
  message.innerHTML = messageText;
  message.id = "messageText";
  popup.appendChild(message);
  var dismissButton = document.createElement("button");
  dismissButton.id = "dismissButton";
  dismissButton.innerHTML = "Dismiss";
  popup.appendChild(dismissButton);

  var dismiss = function dismiss(ev) {
    if (this.ondismissed) {
      this.ondismissed();
    }

    cover.remove();
  }.bind(this); //Prevent people from accidentally closing the message before they can read it.


  setTimeout(function () {
    dismissButton.addEventListener("click", dismiss);
    cover.addEventListener("click", function (event) {
      if (event.target === cover) {
        dismiss();
      }
    });
  }, 500);

  this.show = function () {
    cover.style.display = "";
  };
};

var MessageBar = function MessageBar(text) {
  "use strict";

  _classCallCheck(this, MessageBar);

  var bar = document.createElement("div");
  bar.id = "notificationBar";
  var textHolder = document.createElement("p");
  textHolder.innerHTML = text;
  bar.appendChild(textHolder);

  this.show = function (duration) {
    document.body.appendChild(bar);
    setTimeout(function () {
      bar.remove();
    }, duration);
  };
};

module.exports = {
  Notification: Notification,
  MessageBar: MessageBar
};

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(49);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(94);
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(32);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(50);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(71);
/* harmony import */ var core_js_modules_web_url__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var mobile_drag_drop_scroll_behaviour__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(124);
/* harmony import */ var mobile_drag_drop_scroll_behaviour__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(mobile_drag_drop_scroll_behaviour__WEBPACK_IMPORTED_MODULE_7__);








var StateManager = __webpack_require__(73); //Mobile browsers use the touch API - desktop is drag and drop. We'll use a polyfill so we don't have to implement both.


var mobile_drag_drop_polyfill = __webpack_require__(146).polyfill; // optional import of scroll behaviour


 // options are optional ;)

mobile_drag_drop_polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: mobile_drag_drop_scroll_behaviour__WEBPACK_IMPORTED_MODULE_7__["scrollBehaviourDragImageTranslateOverride"]
});
var url = new URL(window.location);
url.pathname = "/node";
url.protocol = "ws:";

if (window.location.hostname === "127.0.0.1") {
  //Local development
  url.port = 3000;
}

var websocketURL = url.toString();
window.stateManager = new StateManager(websocketURL) //Make classes public to allow for easier development.
;
["Hand", "Tile", "Sequence", "Pretty", "Match", "Wall"].forEach(function (className) {
  window[className] = __webpack_require__(147)("./" + className + ".js");
});

var roomManager = __webpack_require__(122);

var gameBoard = __webpack_require__(113); //While viewport relative units work fine on desktop, some mobile browsers will not show the entire viewport, due to the url bar.
//See https://nicolas-hoizey.com/articles/2015/02/18/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers/
//We will use CSS variables to counteract this bug.


function setVisibleAreaHeight() {
  document.documentElement.style.setProperty('--vh', "".concat(window.innerHeight / 100, "px"));
}

window.addEventListener('resize', setVisibleAreaHeight);
setVisibleAreaHeight(); //Otherwise Safari will scroll the page when the user drags tiles.
//It's possible that we need feature detection for passive listeners, as it may be misinterpreted by older browsers, however I currently observe no side effects.

window.addEventListener('touchmove', function () {}, {
  passive: false
});

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var fails = __webpack_require__(2);
var createElement = __webpack_require__(57);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var setGlobal = __webpack_require__(58);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(5);
var ownKeys = __webpack_require__(127);
var getOwnPropertyDescriptorModule = __webpack_require__(38);
var definePropertyModule = __webpack_require__(8);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);

module.exports = global;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(5);
var toIndexedObject = __webpack_require__(13);
var indexOf = __webpack_require__(63).indexOf;
var hiddenKeys = __webpack_require__(41);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(28).forEach;
var arrayMethodIsStrict = __webpack_require__(45);
var arrayMethodUsesToLength = __webpack_require__(15);

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(67);

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var definePropertyModule = __webpack_require__(8);
var anObject = __webpack_require__(4);
var objectKeys = __webpack_require__(48);

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(18);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var createIteratorConstructor = __webpack_require__(91);
var getPrototypeOf = __webpack_require__(93);
var setPrototypeOf = __webpack_require__(129);
var setToStringTag = __webpack_require__(23);
var createNonEnumerableProperty = __webpack_require__(10);
var redefine = __webpack_require__(11);
var wellKnownSymbol = __webpack_require__(1);
var IS_PURE = __webpack_require__(21);
var Iterators = __webpack_require__(31);
var IteratorsCore = __webpack_require__(92);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(92).IteratorPrototype;
var create = __webpack_require__(47);
var createPropertyDescriptor = __webpack_require__(20);
var setToStringTag = __webpack_require__(23);
var Iterators = __webpack_require__(31);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__(93);
var createNonEnumerableProperty = __webpack_require__(10);
var has = __webpack_require__(5);
var wellKnownSymbol = __webpack_require__(1);
var IS_PURE = __webpack_require__(21);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(5);
var toObject = __webpack_require__(9);
var sharedKey = __webpack_require__(40);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(128);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__(11);
var anObject = __webpack_require__(4);
var fails = __webpack_require__(2);
var flags = __webpack_require__(95);

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(4);

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 96 */
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);
var wellKnownSymbol = __webpack_require__(1);
var IS_PURE = __webpack_require__(21);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(29);
var toObject = __webpack_require__(9);
var callWithSafeIterationClosing = __webpack_require__(99);
var isArrayIteratorMethod = __webpack_require__(100);
var toLength = __webpack_require__(12);
var createProperty = __webpack_require__(51);
var getIteratorMethod = __webpack_require__(52);

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(1);
var Iterators = __webpack_require__(31);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(11);

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(43);
var toInteger = __webpack_require__(42);
var toLength = __webpack_require__(12);
var toObject = __webpack_require__(9);
var arraySpeciesCreate = __webpack_require__(66);
var createProperty = __webpack_require__(51);
var arrayMethodHasSpeciesSupport = __webpack_require__(33);
var arrayMethodUsesToLength = __webpack_require__(15);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(18);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(1);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var aFunction = __webpack_require__(30);
var wellKnownSymbol = __webpack_require__(1);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var fails = __webpack_require__(2);
var classof = __webpack_require__(14);
var bind = __webpack_require__(29);
var html = __webpack_require__(89);
var createElement = __webpack_require__(57);
var IS_IOS = __webpack_require__(107);

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    typeof postMessage == 'function' &&
    !global.importScripts &&
    !fails(post) &&
    location.protocol !== 'file:'
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__(103);

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(30);

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(110);
var anObject = __webpack_require__(4);
var requireObjectCoercible = __webpack_require__(16);
var sameValue = __webpack_require__(145);
var regExpExec = __webpack_require__(111);

// @@search logic
fixRegExpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(34);
var redefine = __webpack_require__(11);
var fails = __webpack_require__(2);
var wellKnownSymbol = __webpack_require__(1);
var regexpExec = __webpack_require__(53);
var createNonEnumerableProperty = __webpack_require__(10);

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(14);
var regexpExec = __webpack_require__(53);

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(75);

__webpack_require__(19);

__webpack_require__(36);

__webpack_require__(114);

__webpack_require__(37);

__webpack_require__(115);

__webpack_require__(148);

__webpack_require__(35);

var Tile = __webpack_require__(24);

var Hand = __webpack_require__(117);

var Wall = __webpack_require__(77);

var Popups = __webpack_require__(78);

var Sequence = __webpack_require__(55);

var Match = __webpack_require__(54);

var gameBoard = document.createElement("div");
gameBoard.id = "gameBoard";
document.body.appendChild(gameBoard);

function createTopOrBottomHand(handId) {
  var hand = document.createElement("div");
  hand.id = handId;
  gameBoard.appendChild(hand);
  return hand;
}

function createLeftOrRightHand(handId, containerId) {
  var hand = createTopOrBottomHand(handId); //We will return the container for the tiles. A container is used for the left and right hands in order to vertically center the tiles.

  var container = document.createElement("div");
  container.id = containerId;
  hand.appendChild(container);
  return container;
}

function Compass() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  config.id = config.id || "compass";
  this.compass = document.createElement("img");
  this.compass.id = config.id;
  gameBoard.appendChild(this.compass);

  this.setDirectionForUserWind = function (userWind) {
    //There are four compasses - compass-north, compass-south, etc. They specify which direction is at the top of the compass, or for the hand across from the users.
    //Convert userWind to the direction for the compass.
    var translations = {
      "north": "south",
      "east": "west",
      "south": "north",
      "west": "east"
    };
    this.compass.src = "assets/compass-" + translations[userWind] + ".svg";
  };
}

var compass = new Compass({
  id: "compass"
});

function FullscreenControls(elementId) {
  var goFullscreenImage = "assets/go-full-screen.svg";
  var exitFullscreenImage = "assets/exit-full-screen.svg";

  if (!document.fullscreenEnabled && document.webkitFullscreenEnabled) {
    //We'll add some support for the webkit prefix.
    Object.defineProperty(document, "fullscreenElement", {
      get: function get() {
        return document.webkitFullscreenElement;
      }
    });

    document.documentElement.requestFullscreen = function () {
      document.documentElement.webkitRequestFullScreen();
    };

    document.exitFullscreen = function () {
      document.webkitExitFullscreen();
    };

    document.addEventListener("webkitfullscreenchange", function () {
      document.dispatchEvent(new Event("fullscreenchange"));
    });
  }

  if (document.fullscreenElement !== undefined) {
    //Support check. This allows users to check toggleElement.
    this.toggleElement = document.createElement("img");
    this.toggleElement.id = elementId;
    this.toggleElement.title = "Toggle Full Screen";
    this.toggleElement.addEventListener("click", function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });

    var setIcon = function setIcon() {
      if (document.fullscreenElement) {
        this.toggleElement.src = exitFullscreenImage;
      } else {
        this.toggleElement.src = goFullscreenImage;
      }
    }.bind(this);

    document.addEventListener("fullscreenchange", setIcon);
    setIcon();
  }
}

var fullscreenControls = new FullscreenControls("fullscreenControls");

if (fullscreenControls.toggleElement) {
  gameBoard.appendChild(fullscreenControls.toggleElement);
}

window.Tile = Tile;
window.Sequence = __webpack_require__(55);
window.Match = __webpack_require__(54);

function createTilePlacemat() {
  var tilePlacemat = document.createElement("div");
  tilePlacemat.id = "tilePlacemat";
  return tilePlacemat;
}

var tilePlacemat = createTilePlacemat();
gameBoard.appendChild(tilePlacemat);
var placeTilesButton = document.createElement("button");
placeTilesButton.id = "placeTilesButton";
placeTilesButton.innerHTML = "Place Tiles";
gameBoard.appendChild(placeTilesButton);
placeTilesButton.addEventListener("click", function () {
  var placement = userHand.inPlacemat;
  console.log(placement);

  if (placement.length === 0) {
    new Popups.Notification("Place Nothing???", "We suggest glasses. ").show();
    return;
  }

  console.log(placement);
  window.stateManager.placeTiles(placement);
});

window.stateManager.onPlaceTiles = function (obj) {
  if (obj.status === "error") {
    new Popups.Notification("Error Placing Tiles", obj.message).show();
  }
};

var nextTurnButton = document.createElement("button");
nextTurnButton.id = "nextTurnButton";
gameBoard.appendChild(nextTurnButton);
nextTurnButton.addEventListener("click", function () {
  window.stateManager.nextTurn();
});
var endGameButton = document.createElement("button");
endGameButton.id = "endGameButton";
endGameButton.innerHTML = "End Game";
gameBoard.appendChild(endGameButton);
endGameButton.addEventListener("click", function () {
  if (confirm("End the game?") && confirm("Are you absolutely sure you want to end the game? You will be blamed. ")) {
    window.stateManager.endGame();
  }
});
var goMahjongButton = document.createElement("button");
goMahjongButton.id = "goMahjongButton";
goMahjongButton.innerHTML = "Mahjong";
gameBoard.appendChild(goMahjongButton);
goMahjongButton.addEventListener("click", function () {
  var placement = userHand.inPlacemat;
  console.log(placement);
  window.stateManager.placeTiles(placement, {
    mahjong: true
  });
});

stateManager.onGameMahjong = function (obj) {
  new Popups.Notification("Mahjong!", obj.message).show();
};

var wallRendering = document.createElement("div");
wallRendering.id = "wall";
gameBoard.appendChild(wallRendering);
var discardPile = document.createElement("div");
discardPile.id = "discardPile";
gameBoard.appendChild(discardPile);

function renderDiscardPile(tileStrings) {
  while (discardPile.firstChild) {
    discardPile.firstChild.remove();
  }

  var tiles = tileStrings.map(function (str) {
    return Tile.fromJSON(str);
  });
  tiles = Hand.sortTiles(tiles);
  tiles.forEach(function (tile) {
    var img = document.createElement("img");
    img.src = tile.imageUrl;
    discardPile.appendChild(img);
  });
}

var userHandElem = createTopOrBottomHand("userHand");
var userHandElemExposed = createTopOrBottomHand("userHandExposed");
var userHand = new Hand({
  handToRender: userHandElem,
  handForExposed: userHandExposed,
  interactive: true,
  tilePlacemat: tilePlacemat
});
window.userHand = userHand;
var rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer");
var rightHand = new Hand({
  handToRender: rightHandContainer
});
var topHandElem = createTopOrBottomHand("topHand");
var topHand = new Hand({
  handToRender: topHandElem
});
var leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer");
var leftHand = new Hand({
  handToRender: leftHandContainer
});
var nametagIds = ["bottomNametag", "leftNametag", "topNametag", "rightNametag"];
var nametags = nametagIds.map(function (id) {
  var nametag = document.createElement("p");
  nametag.id = id;
  gameBoard.appendChild(nametag);
  return nametag;
});
window.stateManager.addEventListener("onStateUpdate", function (obj) {
  var message = obj.message;

  if (!message.inGame) {
    return;
  }

  ;

  if (message.wallTiles) {
    Wall.renderWall(wallRendering, message.wallTiles);
  }

  if (message.discardPile) {
    renderDiscardPile(message.discardPile);
  }

  var clients = message.clients;
  var winds = ["north", "east", "south", "west"];
  var hands = [userHand, leftHand, topHand, rightHand];
  var userWind;
  clients.forEach(function (client) {
    if (client.hand) {
      console.log("User hand stuff");
      var tempHand = Hand.fromString(client.hand);
      userHand.syncContents(tempHand.contents);
      userWind = tempHand.wind;
    }
  });
  var userWindIndex = winds.indexOf(userWind);
  compass.setDirectionForUserWind(userWind);
  var windOrder = winds.slice(userWindIndex).concat(winds.slice(0, userWindIndex));
  console.log(windOrder);
  console.log(hands);
  clients.forEach(function (client) {
    var windPosition = 0;

    if (client.wind) {
      windPosition = windOrder.indexOf(client.wind);
    }

    var hand = hands[windPosition];

    if (client.visibleHand && client.wind) {
      console.log("Client hand stuff");
      console.log(client);
      console.log(client.wind);
      hand.syncContents(Hand.convertStringsToTiles(client.visibleHand));
      hand.wind = client.wind;
    }

    var nametag = nametags[windPosition];
    nametag.innerHTML = client.nickname;
    hand.handToRender.classList.remove("brightnessPulse");

    if (message.currentTurn && client.id === message.currentTurn.userTurn) {
      hand.handToRender.classList.add("brightnessPulse");
    }
  });
  hands.forEach(function (hand) {
    hand.renderTiles();
  });

  if (message.currentTurn && message.currentTurn.thrown) {
    //The person has thrown their tile. Waiting on players to ready.
    nextTurnButton.innerHTML = "Next Turn (" + message.currentTurn.playersReady.length + "/4)";
    nextTurnButton.disabled = message.currentTurn.playersReady.includes(window.clientId) ? "disabled" : "";
    placeTilesButton.disabled = message.currentTurn.playersReady.includes(window.clientId) ? "disabled" : "";

    if (message.currentTurn.userTurn !== clientId) {
      userHand.setEvictingThrownTile(Tile.fromJSON(message.currentTurn.thrown));
    } else {
      userHand.setEvictingThrownTile(); //Clear evictingThrownTile
    }

    userHand.renderPlacemat();
  } else {
    nextTurnButton.disabled = "disabled";
    nextTurnButton.innerHTML = "";
    placeTilesButton.disabled = "";
    userHand.setEvictingThrownTile(); //Clear evictingThrownTile
    //The person has not yet thrown a tile.

    if (message.currentTurn.userTurn === window.clientId) {
      userHand.renderPlacemat("pending");
    }
  }
});
module.exports = gameBoard;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var $indexOf = __webpack_require__(63).indexOf;
var arrayMethodIsStrict = __webpack_require__(45);
var arrayMethodUsesToLength = __webpack_require__(15);

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var isObject = __webpack_require__(6);
var isArray = __webpack_require__(44);
var toAbsoluteIndex = __webpack_require__(43);
var toLength = __webpack_require__(12);
var toIndexedObject = __webpack_require__(13);
var createProperty = __webpack_require__(51);
var wellKnownSymbol = __webpack_require__(1);
var arrayMethodHasSpeciesSupport = __webpack_require__(33);
var arrayMethodUsesToLength = __webpack_require__(15);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var classof = __webpack_require__(14);
var wellKnownSymbol = __webpack_require__(1);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(151);

__webpack_require__(153);

__webpack_require__(154);

__webpack_require__(75);

__webpack_require__(155);

__webpack_require__(156);

__webpack_require__(19);

__webpack_require__(157);

__webpack_require__(36);

__webpack_require__(114);

__webpack_require__(22);

__webpack_require__(37);

__webpack_require__(115);

__webpack_require__(120);

__webpack_require__(102);

__webpack_require__(25);

__webpack_require__(158);

__webpack_require__(159);

__webpack_require__(49);

__webpack_require__(94);

__webpack_require__(32);

__webpack_require__(35);

__webpack_require__(50);

__webpack_require__(26);

__webpack_require__(112);

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(24);

var Match = __webpack_require__(54);

var Sequence = __webpack_require__(55);

var Pretty = __webpack_require__(76);

var Wall = __webpack_require__(77);

var Hand = /*#__PURE__*/function () {
  "use strict";

  function Hand() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Hand);

    //handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
    //interactive: Can the user drag and drop to reorder?
    //tilePlacemat: Element that will allow user to select tiles to expose.
    this.handToRender = config.handToRender;
    this.handForExposed = config.handForExposed;
    this.tilePlacemat = config.tilePlacemat;
    this.interactive = config.interactive || false;
    this.wind = config.wind; //We will also have one events: this.onPlacematChange

    this.contents = []; //Contents of hand.

    this.inPlacemat = []; //Additional contents of hand. In placemat.

    this.add = function (obj) {
      //We will insert the tile where our sorting algorithm would find it most appropriate.
      //TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
      var newItemScore;

      if (obj instanceof Sequence) {
        newItemScore = Hand.getTileValue(obj.tiles[0]); //Use value of first tile in sequence.
      } else {
        newItemScore = Hand.getTileValue(obj);
      }

      for (var i = 0; i < this.contents.length; i++) {
        //Find where to insert this tile.
        var currentItem = this.contents[i];

        if (currentItem instanceof Sequence) {
          //Not quite sure how to handle this.
          currentItem = currentItem.tiles[2]; //Get the value using the last tile in sequence.
        }

        var currentScore = Hand.getTileValue(currentItem); //Value of the tile in that position

        if (newItemScore < currentScore) {
          this.contents.splice(i, 0, obj);
          return;
        }
      }

      this.contents.push(obj);
    }.bind(this);

    this.remove = function (obj) {
      console.log(obj);
      var index = this.contents.findIndex(function (value) {
        return value === obj;
      });
      var placematIndex = this.inPlacemat.findIndex(function (value) {
        return value === obj;
      });

      if (index !== -1) {
        this.contents.splice(index, 1);
      } else if (placematIndex !== -1) {
        this.inPlacemat.splice(placematIndex, 1);
      } else {
        throw obj + " does not exist in hand. ";
      }
    }.bind(this);

    this.getExposedTiles = function () {
      var includeFaceDown = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var exposedTiles = [];
      this.contents.forEach(function (item) {
        if (item.exposed) {
          exposedTiles.push(item);
        } else if (item instanceof Match && item.amount === 4) {
          //If it is stored as a match, but not exposed, is in hand kong.
          //Is not stored as a match if the user never placed them downw
          exposedTiles.push(item);
        } else if (includeFaceDown) {
          exposedTiles.push(new Tile({
            faceDown: true
          }));
        }
      });
      return exposedTiles;
    }.bind(this);

    this.syncContents = function (syncContents) {
      //We allow the user to sort their hand by themselves, however it is possible that, due to lag or other reasons, the users hand ends up not matching the server.
      //This function will sync the contents of the users hand with contents, preserving some user ordering.
      var currentContentsStrings = [];
      var syncContentsStrings = [];
      console.log(this.contents.length);
      this.contents.forEach(function (item) {
        currentContentsStrings.push(item.toJSON());
      });
      console.log(this.inPlacemat.length);
      this.inPlacemat.forEach(function (item) {
        if (item.evicting) {
          return;
        }

        currentContentsStrings.push(item.toJSON());
      });
      syncContents.forEach(function (item) {
        syncContentsStrings.push(item.toJSON());
      }); //Let's go through both arrays, and see what needs to change.
      //We'll stringify, because these are not identical instances, and therefore == will not work.

      for (var i = 0; i < currentContentsStrings.length; i++) {
        var str = currentContentsStrings[i];

        if (str && syncContentsStrings.includes(str)) {
          currentContentsStrings[i] = null;
          syncContentsStrings[syncContentsStrings.indexOf(str)] = null;
        }
      } //Save tempContents now, because we add items to the array later, and they mess up ordering otherwise.


      var tempContents = this.contents.slice(0); //We are cloning the array, however the referenced objects remain the same. This prevents us from having to adjust indexes for items when we remove other items.

      if (this.inPlacemat[0] && this.inPlacemat[0].evicting) {
        tempContents = tempContents.concat(this.inPlacemat.slice(1));
      } else {
        tempContents = tempContents.concat(this.inPlacemat.slice(0));
      } //Everything that matches is now nulled out.
      //Add the things in syncContents but not in currentContents


      for (var _i = 0; _i < syncContentsStrings.length; _i++) {
        var item = syncContentsStrings[_i];

        if (item) {
          this.add(syncContents[_i]);
        }
      }

      for (var _i2 = 0; _i2 < currentContentsStrings.length; _i2++) {
        var _item = currentContentsStrings[_i2];

        if (_item) {
          this.remove(tempContents[_i2]);
        }
      }
    }.bind(this);

    function allowDrop(ev) {
      ev.preventDefault();
    }

    function dragstart(ev) {
      var randomClass = "randomClassForTransfer" + Math.pow(2, 53) * Math.random();
      ev.target.classList.add(randomClass);
      ev.dataTransfer.setData("randomClass", randomClass);
    }

    var dropOnHand = function dropOnHand(ev) {
      ev.preventDefault();
      var randomClass = ev.dataTransfer.getData("randomClass");
      var elem = document.getElementsByClassName(randomClass)[0];
      elem.classList.remove(randomClass);
      var dropPosition = ev.x;
      var targetBounds = ev.target.getBoundingClientRect();
      var targetIndex = ev.target.tileIndex;

      if (targetBounds.right - ev.x < targetBounds.width / 2) {
        //Dropped on right side of tile. Insert after.
        targetIndex++;
      }

      var targetTile = this.contents[targetIndex];
      var currentTile;

      if (elem.placematIndex !== undefined) {
        //We are dragging out of the placemat, into the hand.
        if (elem.placematIndex === 0 && this.inPlacemat[0].evicting) {
          console.log("Blocked dragging of evictingThrownTile");
          alert("You can't bring the thrown tile into your hand. You can only place it down along with other tiles that match it or form a sequence. ");
          return;
        }

        currentTile = this.inPlacemat.splice(elem.placematIndex, 1)[0];
      } else {
        //Reordering hand.
        currentTile = this.contents.splice(elem.tileIndex, 1)[0];
      }

      if (targetIndex <= this.contents.length) {
        var newTargetIndex = this.contents.findIndex(function (tile) {
          return targetTile === tile;
        });
        this.contents.splice(newTargetIndex, 0, currentTile);
      } else {
        this.contents.push(currentTile);
      }

      this.renderTiles(); //Re-render.
    }.bind(this);

    var dropOnPlacemat = function dropOnPlacemat(ev) {
      ev.preventDefault();
      var randomClass = ev.dataTransfer.getData("randomClass");
      var elem = document.getElementsByClassName(randomClass)[0];
      elem.classList.remove(randomClass);
      var currentTile = this.contents[elem.tileIndex];

      if (!currentTile) {
        return;
      }

      if (this.inPlacemat.length >= 4) {
        alert("Placemat is already full. ");
        return;
      } else {
        this.inPlacemat.push(this.contents.splice(elem.tileIndex, 1)[0]);
      }

      this.renderTiles();
    }.bind(this);

    if (this.interactive) {
      this.handToRender.addEventListener("dragover", allowDrop);
      this.handToRender.addEventListener("dragenter", allowDrop);
      this.handToRender.addEventListener("drop", dropOnHand);

      if (this.tilePlacemat) {
        this.tilePlacemat.addEventListener("dragover", allowDrop);
        this.tilePlacemat.addEventListener("dragenter", allowDrop);
        this.tilePlacemat.addEventListener("drop", dropOnPlacemat);
        this.tilePlacemat.addEventListener("dragover", function () {
          this.style.backgroundColor = "lightblue";
        });
        this.tilePlacemat.addEventListener("dragleave", function () {
          this.style.backgroundColor = "";
        });
        this.tilePlacemat.addEventListener("drop", function () {
          this.style.backgroundColor = "";
        });
      }
    }

    this.removeTilesFromHand = function removeTilesFromHand(obj) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var simulated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      //We will verify that the tiles CAN be removed before removing them.
      var contents = this.getStringContents();
      var toRemove = obj.toJSON();
      var indexes = [];
      contents.forEach(function (str, index) {
        if (toRemove === str) {
          indexes.push(index);
        }
      });

      if (indexes.length >= amount) {
        if (simulated) {
          return true;
        }

        for (var i = 0; i < amount; i++) {
          this.contents.splice(indexes[indexes.length - 1 - i], 1); //Remove the item the farthest back in the hand to avoid position shifting.
        }

        return true;
      } else {
        return false;
      }
    }.bind(this);

    this.removeSequenceFromHand = function removeSequenceFromHand(sequence) {
      var _this = this;

      var simulated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      //We will verify that the tiles CAN be removed before removing them.
      var contents = this.getStringContents();
      var indexes = [];
      JSON.parse(JSON.stringify(sequence.tiles)).forEach(function (str, index) {
        for (var i = contents.length - 1; i >= 0; i--) {
          if (contents[i] === str) {
            indexes[index] = i;
            return;
          }
        }
      });

      if (indexes[0] !== undefined && indexes[1] !== undefined && indexes[2] !== undefined) {
        if (simulated) {
          return true;
        } //Remove the item the farthest back in the hand to avoid position shifting.


        indexes.sort(function (a, b) {
          return b - a;
        }).forEach(function (index) {
          _this.contents.splice(index, 1);
        });
        return true;
      } else {
        return false;
      }
    }.bind(this);

    this.renderPlacemat = function (classForFirst) {
      while (this.tilePlacemat.firstChild) {
        this.tilePlacemat.firstChild.remove();
      } //Delete everything currently rendered in the hand.


      for (var i = 0; i < 4; i++) {
        var tile = this.inPlacemat[i];
        var elem = document.createElement("img");

        if (i === 0 && classForFirst) {
          elem.className = classForFirst;
        }

        if (tile) {
          elem.src = tile.imageUrl; //Both work. Using i is faster and simpler.

          elem.placematIndex = i; //this.inPlacemat.findIndex((item) => {return item === tile})

          elem.addEventListener("dragstart", dragstart);
        } else {
          elem.src = "assets/tiles/tile-outline.png";
        }

        this.tilePlacemat.appendChild(elem);
      }
    }.bind(this);

    this.setEvictingThrownTile = function (tile) {
      //Clear the other evicting tile, even if it's position has moved due to some glitch or user hacking.
      for (var i = this.inPlacemat.length - 1; i >= 0; i--) {
        var item = this.inPlacemat[i];

        if (item.evicting) {
          this.inPlacemat.splice(i, 1);
        }
      }

      if (tile) {
        if (this.inPlacemat.length >= 4) {
          this.contents.push(this.inPlacemat.pop());
        }

        this.inPlacemat.unshift(tile);
        tile.evicting = true;
      }
    }.bind(this);

    this.renderTiles = function () {
      if (!this.handToRender) {
        throw "Unable to render hand. You must pass config.handToRender to the constructor. ";
      }

      while (this.handToRender.firstChild) {
        this.handToRender.firstChild.remove();
      } //Delete everything currently rendered in the hand.


      if (this.handForExposed) {
        while (this.handForExposed.firstChild) {
          this.handForExposed.firstChild.remove();
        } //Delete everything currently rendered in the hand.

      }

      var unexposedTiles = [];
      var exposedTiles = [];

      for (var i = 0; i < this.contents.length; i++) {
        var item = this.contents[i];

        if (item instanceof Tile) {
          unexposedTiles.push(item);
        } else if (item instanceof Pretty) {
          exposedTiles.push(item);
        } else if (item instanceof Match || item instanceof Sequence) {
          var items = item.tiles;

          if (item instanceof Match) {
            if (item.amount === 4) {
              //kong. Flip 1 tile.
              items[0] = new Tile({
                faceDown: true
              });
            }
          }

          if (item.exposed) {
            exposedTiles = exposedTiles.concat(items);
          } else {
            if (item instanceof Match && item.amount === 4) {
              //In hand kong. Expose with 2 flipped tiles. (One already flipped)
              items[3] = new Tile({
                faceDown: true
              });
              exposedTiles.concat(items);
            } else {
              console.log(items);
              unexposedTiles = unexposedTiles.concat(items);
            }
          }
        } else {
          console.error("Unknown item " + item);
        }
      }

      var drawTiles = function drawTiles(tiles, type) {
        var _this2 = this;

        var _loop = function _loop(_i3) {
          var tile = tiles[_i3];
          var elem = document.createElement("img");
          elem.src = tile.imageUrl;

          if (type === "exposed" && _this2.handForExposed) {
            _this2.handForExposed.appendChild(elem);
          } else if (type === "exposed") {
            _this2.handToRender.appendChild(elem);
          } else if (type === "unexposed") {
            if (_this2.interactive) {
              elem.draggable = true;
              elem.addEventListener("dragstart", dragstart);
              elem.tileIndex = _this2.contents.findIndex(function (item) {
                return item === tile;
              });
            }

            _this2.handToRender.appendChild(elem);
          }
        };

        for (var _i3 = 0; _i3 < tiles.length; _i3++) {
          _loop(_i3);
        }
      }.bind(this);

      drawTiles(exposedTiles, "exposed");
      drawTiles(unexposedTiles, "unexposed");

      if (this.tilePlacemat) {
        this.renderPlacemat();
      }
    }.bind(this);

    this.getStringContents = function () {
      var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "contents";
      //Can also pass "inPlacemat" for placemat contents.
      return JSON.parse(JSON.stringify(this[prop]));
    }.bind(this);

    this.toJSON = function () {
      return JSON.stringify({
        wind: this.wind,
        contents: this.contents
      });
    }.bind(this);
  }

  _createClass(Hand, null, [{
    key: "getTileValue",
    value: function getTileValue(tile) {
      //The greater the value, the further to the right we place the tile.
      var tileValue = 0;
      tileValue += 100 * ["pretty", "circle", "bamboo", "character", "wind", "dragon"].findIndex(function (suit) {
        return tile.type === suit;
      });

      if (typeof tile.value === "number") {
        tileValue += tile.value;
      } else if (tile.type === "wind") {
        tileValue += 10 * ["north", "east", "south", "west"].findIndex(function (value) {
          return tile.value === value;
        });
      } else if (tile.type === "dragon") {
        tileValue += 10 * ["red", "green", "white"].findIndex(function (value) {
          return tile.value === value;
        });
      } else if (!tile.faceDown) {
        console.error("Couldn't fully calculate value for " + tile);
      }

      return tileValue;
    }
  }, {
    key: "sortTiles",
    value: function sortTiles(tiles) {
      return tiles.sort(function (tile1, tile2) {
        return Hand.getTileValue(tile1) - Hand.getTileValue(tile2);
      });
    }
  }, {
    key: "scoreHand",
    value: function scoreHand(hand) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (hand instanceof Hand) {
        hand = hand.contents;
      } //Hand is an array of arrays of Tiles, Matches, and Prettys


      var doubles = 0;
      var score = 0;
      var sequences = false;

      if (!config.userWind) {
        console.warn("scoreHand not provided config.userWind, may result in improper scoring. ");
      }

      for (var i = 0; i < hand.length; i++) {
        var match = hand[i];
        doubles += match.isDouble(config.userWind);
        score += match.getPoints(config.userWind);
        sequences = sequences || match.isSequence;
      }

      if (config.isMahjong) {
        score += 20;

        if (config.drewOwnTile) {
          score += 10;
        }

        if (!sequences) {
          score += 10;
        }
      }

      doubles += Hand.getClearHandDoubles(hand);
      return score * Math.pow(2, doubles);
    }
  }, {
    key: "getClearHandDoubles",
    value: function getClearHandDoubles(hand) {
      if (hand instanceof Hand) {
        hand = hand.contents;
      }

      var suits = {};
      var honors = false;
      var onesAndNines = true;
      hand.forEach(function (item) {
        if (item instanceof Sequence) {
          suits[item.tiles[0].type] = true;
          onesAndNines = false;
        } else if (!(item instanceof Pretty)) {
          suits[item.type] = true;

          if (item.value !== 1 && item.value !== 9) {
            onesAndNines = false;
          }
        }
      });

      if (suits["wind"] || suits["dragon"]) {
        delete suits["wind"];
        delete suits["dragon"];
        honors = true;
      }

      suits = Object.keys(suits).length;

      if (suits === 0) {
        //All honors
        return 3;
      } else if (suits === 1 && !honors) {
        return 3;
      } else if (suits === 1 && honors) {
        return 1;
      } else if (onesAndNines && !honors) {
        return 3;
      } else if (onesAndNines && honors) {
        return 1;
      }

      return 0;
    }
  }, {
    key: "isMahjong",
    value: function isMahjong(hand, unlimitedSequences) {
      var _marked2 = /*#__PURE__*/regeneratorRuntime.mark(generateCombinations);

      if (hand instanceof Hand) {
        hand = hand.contents;
      } //Returns 2 for mahjong, and 0 for not mahjong.
      //If the hand is not currently committed to mahjong, but is mahjong, a hand containing the organization resulting in mahjong will be returned.


      var pongOrKong = 0;
      var pairs = 0;
      var sequences = 0;
      var remainingTiles = [];
      var initialTiles = [];

      for (var i = 0; i < hand.length; i++) {
        var match = hand[i];

        if (match.isPongOrKong) {
          pongOrKong++;
          initialTiles.push(match);
        } else if (match.isPair) {
          pairs++;
          initialTiles.push(match);
        } else if (match.isSequence) {
          sequences++;
          initialTiles.push(match);
        } else if (match instanceof Pretty) {
          initialTiles.push(match);
        } else {
          remainingTiles.push(match);
        }
      }

      if (pairs === 1) {
        if (unlimitedSequences) {
          if (sequences + pongOrKong === 4) {
            return 2;
          }
        } else {
          if (Math.min(sequences, 1) + pongOrKong === 4) {
            return 2;
          }
        }
      } //Now we need to go through our remaining tiles.


      console.log(pongOrKong, sequences, pairs);
      console.log(remainingTiles);
      var allTiles = Hand.sortTiles(Wall.getNonPrettyTiles(1));
      var possibleMatches = [];
      var possibleSequences = [];
      var testingHand = new Hand();
      testingHand.contents = remainingTiles.slice(0);
      allTiles.forEach(function (tile) {
        if (testingHand.removeTilesFromHand(tile, 3, true)) {
          possibleMatches.push(tile);
        }
      });
      allTiles.forEach(function (tile, index) {
        if (!Sequence.isValidSequence(allTiles.slice(index, index + 3))) {
          return;
        }

        var sequence = new Sequence({
          exposed: false,
          tiles: allTiles.slice(index, index + 3)
        });

        if (testingHand.removeSequenceFromHand(sequence, true)) {
          possibleSequences.push(sequence);
        }
      }); //https://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array/39092843#39092843

      function generateCombinations(arr, size) {
        var _marked, doGenerateCombinations;

        return regeneratorRuntime.wrap(function generateCombinations$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                doGenerateCombinations = function _doGenerateCombinatio(offset, combo) {
                  var _i4;

                  return regeneratorRuntime.wrap(function doGenerateCombinations$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(combo.length == size)) {
                            _context.next = 5;
                            break;
                          }

                          _context.next = 3;
                          return combo;

                        case 3:
                          _context.next = 11;
                          break;

                        case 5:
                          _i4 = offset;

                        case 6:
                          if (!(_i4 < arr.length)) {
                            _context.next = 11;
                            break;
                          }

                          return _context.delegateYield(doGenerateCombinations(_i4 + 1, combo.concat(arr[_i4])), "t0", 8);

                        case 8:
                          _i4++;
                          _context.next = 6;
                          break;

                        case 11:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _marked);
                };

                _marked = /*#__PURE__*/regeneratorRuntime.mark(doGenerateCombinations);
                return _context2.delegateYield(doGenerateCombinations(0, []), "t0", 3);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _marked2);
      }

      var combinations = [];
      var allPossibilities = possibleMatches;
      var neededPongEquivs = 4;

      if (unlimitedSequences || sequences === 0) {
        allPossibilities = allPossibilities.concat(possibleSequences);
        neededPongEquivs -= sequences;
      } else {
        neededPongEquivs -= Math.min(sequences, 1);
      }

      neededPongEquivs -= pongOrKong;
      console.log(neededPongEquivs);

      var _iterator = _createForOfIteratorHelper(generateCombinations(allPossibilities, neededPongEquivs)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var combo = _step.value;
          combinations.push(combo);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      console.log(possibleMatches);
      console.log(possibleSequences);
      console.log(combinations);
      var successfulCombinations = [];
      combinations.forEach(function (combo, index) {
        var localTestHand = new Hand();
        localTestHand.contents = testingHand.contents.slice(0);

        for (var _i5 = 0; _i5 < combo.length; _i5++) {
          var item = combo[_i5];

          if (item instanceof Tile) {
            if (!localTestHand.removeTilesFromHand(item, 3)) {
              return 0;
            }

            localTestHand.add(new Match({
              type: item.type,
              value: item.value,
              exposed: false,
              amount: 3
            }));
          } else if (item instanceof Sequence) {
            if (!localTestHand.removeSequenceFromHand(item)) {
              return 0;
            }

            localTestHand.add(item);
          }
        } //Check for a pair


        var tile = localTestHand.contents.filter(function (item) {
          return item instanceof Tile;
        })[0];

        if (!localTestHand.removeTilesFromHand(tile, 2, true)) {
          return 0;
        } else {
          localTestHand.add(new Match({
            type: tile.type,
            value: tile.value,
            exposed: false,
            amount: 2
          }));
          localTestHand.removeTilesFromHand(tile, 2);
          localTestHand.contents = localTestHand.contents.concat(initialTiles.slice(0));
          successfulCombinations.push(localTestHand);
          return true;
        }
      });
      console.log(successfulCombinations);

      if (successfulCombinations.length > 1) {
        alert("You've created a hand that our code didn't know was possible. Everything may work fine, but please take a screenshot of your hand and open an issue at https://github.com/ecc521/mahjong. ");
      }

      if (successfulCombinations.length > 0) {
        return successfulCombinations[0];
      }

      return 0;
    }
  }, {
    key: "convertStringsToTiles",
    value: function convertStringsToTiles(arr) {
      //arr is an array, with the stringified contents of the hand.
      var contents = arr.map(function (itemStr) {
        var obj = JSON.parse(itemStr);

        if (obj.class === "Pretty") {
          return Pretty.fromJSON(itemStr);
        } else if (obj.class === "Tile") {
          return Tile.fromJSON(itemStr);
        } else if (obj.class === "Sequence") {
          return Sequence.fromJSON(itemStr);
        } else if (obj.class === "Match") {
          return Match.fromJSON(itemStr);
        } else {
          throw "Unable to identify itemString " + itemStr;
        }
      });
      return contents;
    }
  }, {
    key: "fromString",
    value: function fromString(str) {
      //Hand.fromString is only meant to be used on the server side. Therefore, it will not attempt to carry over any functionality that would be client side.
      var obj = JSON.parse(str);
      var wind = obj.wind;
      var hand = new Hand({
        wind: obj.wind
      });
      hand.contents = Hand.convertStringsToTiles(obj.contents);
      return hand;
    }
  }]);

  return Hand;
}();

module.exports = Hand;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(1);

exports.f = wellKnownSymbol;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(83);
var has = __webpack_require__(5);
var wrappedWellKnownSymbolModule = __webpack_require__(118);
var defineProperty = __webpack_require__(8).f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var aFunction = __webpack_require__(30);
var toObject = __webpack_require__(9);
var fails = __webpack_require__(2);
var arrayMethodIsStrict = __webpack_require__(45);

var test = [];
var nativeSort = test.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(110);
var isRegExp = __webpack_require__(116);
var anObject = __webpack_require__(4);
var requireObjectCoercible = __webpack_require__(16);
var speciesConstructor = __webpack_require__(105);
var advanceStringIndex = __webpack_require__(162);
var toLength = __webpack_require__(12);
var callRegExpExec = __webpack_require__(111);
var regexpExec = __webpack_require__(53);
var fails = __webpack_require__(2);

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(19);

__webpack_require__(22);

__webpack_require__(49);

__webpack_require__(34);

__webpack_require__(32);

__webpack_require__(109);

__webpack_require__(164);

__webpack_require__(35);

__webpack_require__(50);

__webpack_require__(71);

var Popups = __webpack_require__(78); //Allow the user to join and create rooms.


var roomManager = document.createElement("div");
roomManager.id = "roomManager";
document.body.appendChild(roomManager);
var copyrightNotice = document.createElement("p");
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved";
copyrightNotice.id = "copyrightNotice";
roomManager.appendChild(copyrightNotice); //In order to get the "with friends" part styled differently, we will need 3 elements for our heading.

var heading = document.createElement("div");
heading.id = "heading";
roomManager.appendChild(heading);
var mahjongHeading = document.createElement("h1");
mahjongHeading.innerHTML = "Mahjong";
mahjongHeading.id = "mahjongHeading";
heading.appendChild(mahjongHeading);
var withFriendsHeading = document.createElement("h1");
withFriendsHeading.innerHTML = "with Friends";
withFriendsHeading.id = "withFriendsHeading";
heading.appendChild(withFriendsHeading); //notInRoomContainer: The stuff to create or join a room.

var notInRoomContainer = document.createElement("div");
notInRoomContainer.id = "notInRoomContainer";
roomManager.appendChild(notInRoomContainer);
var roomIdInput = document.createElement("input");
roomIdInput.id = "roomIdInput";
roomIdInput.placeholder = "Enter Room Name...";
notInRoomContainer.appendChild(roomIdInput); //Put the nickname input on a new line.

notInRoomContainer.appendChild(document.createElement("br"));
var nicknameInput = document.createElement("input");
nicknameInput.id = "nicknameInput";
nicknameInput.placeholder = "Choose a Nickname...";
notInRoomContainer.appendChild(nicknameInput); //The join/create room buttons.

var joinOrCreateRoom = document.createElement("div");
joinOrCreateRoom.id = "joinOrCreateRoom";
notInRoomContainer.appendChild(joinOrCreateRoom);
var joinRoom = document.createElement("button");
joinRoom.id = "joinRoom";
joinRoom.innerHTML = "Join Room";
joinRoom.addEventListener("click", function () {
  if (roomIdInput.value.trim().length < 5) {
    return new Popups.Notification("Room Name Invalid", "The room name should be at least 5 characters long. Please enter it into the box labeled \"Enter Room Name\" ").show();
  }

  window.stateManager.joinRoom(roomIdInput.value, nicknameInput.value);
});
joinOrCreateRoom.appendChild(joinRoom);
var createRoom = document.createElement("button");
createRoom.id = "createRoom";
createRoom.innerHTML = "Create Room";
createRoom.addEventListener("click", function () {
  if (roomIdInput.value.trim().length < 5) {
    return new Popups.Notification("Unable to Create Room", "Please pick a 5+ character long name, and enter it into the box labeled \"Enter Room Name\" ").show();
  }

  window.stateManager.createRoom(roomIdInput.value, nicknameInput.value);
});
joinOrCreateRoom.appendChild(createRoom);
var inRoomContainer = document.createElement("div");
inRoomContainer.id = "inRoomContainer";
inRoomContainer.style.display = "none";
roomManager.appendChild(inRoomContainer);
var currentRoom = document.createElement("h2");
currentRoom.id = "currentRoom";
inRoomContainer.appendChild(currentRoom);
var playerCount = document.createElement("h2");
playerCount.id = "playerCount";
inRoomContainer.appendChild(playerCount);
var playerView = document.createElement("div");
playerView.id = "playerView";
inRoomContainer.appendChild(playerView);
var leaveRoomButton = document.createElement("button");
leaveRoomButton.innerHTML = "Leave Room";
leaveRoomButton.id = "leaveRoomButton";
inRoomContainer.appendChild(leaveRoomButton);
leaveRoomButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to leave this room?")) {
    window.stateManager.leaveRoom(window.stateManager.roomId);
  }
});
var closeRoomButton = document.createElement("button");
closeRoomButton.innerHTML = "Close Room";
closeRoomButton.id = "closeRoomButton";
closeRoomButton.style.display = "none";
inRoomContainer.appendChild(closeRoomButton);
closeRoomButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to close this room?")) {
    window.stateManager.closeRoom(window.stateManager.roomId);
  }
});
var startGameButton = document.createElement("button");
startGameButton.innerHTML = "Start Game";
startGameButton.id = "startGameButton";
startGameButton.style.display = "none";
inRoomContainer.appendChild(startGameButton);
startGameButton.addEventListener("click", function () {
  window.stateManager.startGame();
});

function renderPlayerView() {
  var clientList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var kickUserCallback = arguments.length > 1 ? arguments[1] : undefined;

  while (playerView.firstChild) {
    playerView.firstChild.remove();
  }

  clientList.forEach(function (obj) {
    var row = document.createElement("div");
    row.className = "playerViewRow";
    var nameSpan = document.createElement("span");
    nameSpan.className = "playerViewNameSpan";
    nameSpan.innerHTML = obj.nickname;
    row.appendChild(nameSpan);
    var card = document.createElement("span");
    card.className = "playerViewCard";
    row.appendChild(card);
    var idSpan = document.createElement("span");
    idSpan.className = "playerViewIdSpan";
    idSpan.innerHTML = "User ID: " + obj.id;
    row.appendChild(idSpan);

    if (obj.id === window.clientId) {
      if (window.stateManager.isHost) {
        card.innerHTML = "You (Host)";
      } else {
        card.innerHTML = "You";
      }
    } else if (obj.isHost) {
      card.innerHTML = "Host";
    } else if (window.stateManager.isHost) {
      card.innerHTML = "Kick " + obj.nickname;
      card.classList.add("playerViewKickButton");
      card.addEventListener("click", function () {
        if (confirm("Are you sure you want to kick " + obj.nickname)) {
          kickUserCallback(obj.id);
        }
      });
    } else {
      card.innerHTML = "Player";
    }

    playerView.appendChild(row);
  });
}

function enterRoom() {
  inRoomContainer.style.display = "block";
  notInRoomContainer.style.display = "none";
}

function exitRoom() {
  inRoomContainer.style.display = "none";
  notInRoomContainer.style.display = "block";
}

window.stateManager.onJoinRoom = function (obj) {
  if (obj.status === "error") {
    return new Popups.Notification("Unable to Join Room", obj.message).show();
  } else {
    currentRoom.innerHTML = "You are in room " + obj.message;
    enterRoom();
  }
};

window.stateManager.onCreateRoom = function (obj) {
  if (obj.status === "error") {
    return new Popups.Notification("Unable to Create Room", obj.message).show();
  } else {
    currentRoom.innerHTML = "You are hosting room " + obj.message;
    enterRoom();
  }
};

window.stateManager.onLeaveRoom = function (obj) {
  exitRoom(); //We left the room. Change clientId.

  var StateManager = __webpack_require__(73);

  StateManager.setClientId(StateManager.createNewClientId());
  new Popups.Notification("Out of Room", obj.message).show();
};

window.stateManager.addEventListener("onStateUpdate", function (obj) {
  console.log(obj);
  playerCount.innerHTML = obj.message.clients.length + "/4 Players are Present";

  if (obj.message.clients.length === 4 && window.stateManager.isHost) {
    startGameButton.style.display = "";
  } else {
    startGameButton.style.display = "none";
  }

  if (window.stateManager.isHost) {
    closeRoomButton.style.display = "";
  } else {
    closeRoomButton.style.display = "none";
  }

  if (obj.message.clients.length === 1 && window.stateManager.isHost) {
    //This player is the only one in the room. (So if they aren't host, there's a bug)
    //If they leave, the room closes. Hide the leave room button.
    leaveRoomButton.style.display = "none";
  } else {
    leaveRoomButton.style.display = "";
  }

  renderPlayerView(obj.message.clients, function kickUserCallback(userId) {
    window.stateManager.kickUser(window.stateManager.roomId, userId);
  });
});
window.stateManager.getCurrentRoom(); //If we are already in a room, this will issue the correct callbacks to enter us into it.

window.stateManager.addEventListener("onStartGame", function () {
  roomManager.style.display = "none";
});
window.stateManager.addEventListener("onEndGame", function (obj) {
  roomManager.style.display = "";

  if (!isDevMode || obj.message !== "State Sync") {
    //If we are in dev mode, and the message is "State Sync", suppress this warning.
    new Popups.Notification("Game Ended", obj.message).show();
  } else {
    console.log("Game Ended due to state sync. Popup suppressed in dev mode. ");
  }
});
var isDevMode = false; //Allow query params.

var params = new URLSearchParams(window.location.search);

if (params.has("roomId")) {
  roomIdInput.value = params.get("roomId");
}

if (params.has("name")) {
  nicknameInput.value = params.get("name");
} //This feature is for development use only. Show a warning.


if (params.has("clientId")) {
  isDevMode = true;
  new Popups.MessageBar("This page is in development mode due to the clientId parameter. ").show(8000);
}

module.exports = roomManager;

/***/ }),
/* 123 */
/***/ (function(module, exports) {

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports) :
	undefined;
}(this, (function (exports) { 'use strict';

function isTopLevelEl(el) {
    return (el === document.body || el === document.documentElement);
}
function getElementViewportOffset(el, axis) {
    var offset;
    if (isTopLevelEl(el)) {
        offset = (axis === 0) ? el.clientLeft : el.clientTop;
    }
    else {
        var bounds = el.getBoundingClientRect();
        offset = (axis === 0) ? bounds.left : bounds.top;
    }
    return offset;
}
function getElementViewportSize(el, axis) {
    var size;
    if (isTopLevelEl(el)) {
        size = (axis === 0) ? window.innerWidth : window.innerHeight;
    }
    else {
        size = (axis === 0) ? el.clientWidth : el.clientHeight;
    }
    return size;
}
function getSetElementScroll(el, axis, scroll) {
    var prop = (axis === 0) ? "scrollLeft" : "scrollTop";
    var isTopLevel = isTopLevelEl(el);
    if (arguments.length === 2) {
        if (isTopLevel) {
            return document.body[prop] || document.documentElement[prop];
        }
        return el[prop];
    }
    if (isTopLevel) {
        document.documentElement[prop] += scroll;
        document.body[prop] += scroll;
    }
    else {
        el[prop] += scroll;
    }
}
function isScrollable(el) {
    var cs = getComputedStyle(el);
    if (el.scrollHeight > el.clientHeight && (cs.overflowY === "scroll" || cs.overflowY === "auto")) {
        return true;
    }
    if (el.scrollWidth > el.clientWidth && (cs.overflowX === "scroll" || cs.overflowX === "auto")) {
        return true;
    }
    return false;
}
function findScrollableParent(el) {
    do {
        if (!el) {
            return undefined;
        }
        if (isScrollable(el)) {
            return el;
        }
        if (el === document.documentElement) {
            return null;
        }
    } while (el = el.parentNode);
    return null;
}
function determineScrollIntention(currentCoordinate, size, threshold) {
    if (currentCoordinate < threshold) {
        return -1;
    }
    else if (size - currentCoordinate < threshold) {
        return 1;
    }
    return 0;
}
function determineDynamicVelocity(scrollIntention, currentCoordinate, size, threshold) {
    if (scrollIntention === -1) {
        return Math.abs(currentCoordinate - threshold);
    }
    else if (scrollIntention === 1) {
        return Math.abs(size - currentCoordinate - threshold);
    }
    return 0;
}
function isScrollEndReached(axis, scrollIntention, scrollBounds) {
    var currentScrollOffset = (axis === 0) ? (scrollBounds.scrollX) : (scrollBounds.scrollY);
    if (scrollIntention === 1) {
        var maxScrollOffset = (axis === 0) ? (scrollBounds.scrollWidth - scrollBounds.width) : (scrollBounds.scrollHeight -
            scrollBounds.height);
        return currentScrollOffset >= maxScrollOffset;
    }
    else if (scrollIntention === -1) {
        return (currentScrollOffset <= 0);
    }
    return true;
}
var _options = {
    threshold: 75,
    velocityFn: function (velocity, threshold) {
        var multiplier = velocity / threshold;
        var easeInCubic = multiplier * multiplier * multiplier;
        return easeInCubic * threshold;
    }
};
var _scrollIntentions = {
    horizontal: 0,
    vertical: 0
};
var _dynamicVelocity = {
    x: 0,
    y: 0
};
var _scrollAnimationFrameId;
var _currentCoordinates;
var _hoveredElement;
var _scrollableParent;
var _translateDragImageFn;
function handleDragImageTranslateOverride(event, currentCoordinates, hoveredElement, translateDragImageFn) {
    _currentCoordinates = currentCoordinates;
    _translateDragImageFn = translateDragImageFn;
    if (_hoveredElement !== hoveredElement) {
        _hoveredElement = hoveredElement;
        _scrollableParent = findScrollableParent(_hoveredElement);
    }
    var performScrollAnimation = updateScrollIntentions(_currentCoordinates, _scrollableParent, _options.threshold, _scrollIntentions, _dynamicVelocity);
    if (performScrollAnimation) {
        scheduleScrollAnimation();
    }
    else if (!!_scrollAnimationFrameId) {
        window.cancelAnimationFrame(_scrollAnimationFrameId);
        _scrollAnimationFrameId = null;
    }
}
function scheduleScrollAnimation() {
    if (!!_scrollAnimationFrameId) {
        return;
    }
    _scrollAnimationFrameId = window.requestAnimationFrame(scrollAnimation);
}
function scrollAnimation() {
    var scrollDiffX = 0, scrollDiffY = 0, isTopLevel = isTopLevelEl(_scrollableParent);
    if (_scrollIntentions.horizontal !== 0) {
        scrollDiffX = Math.round(_options.velocityFn(_dynamicVelocity.x, _options.threshold) * _scrollIntentions.horizontal);
        getSetElementScroll(_scrollableParent, 0, scrollDiffX);
    }
    if (_scrollIntentions.vertical !== 0) {
        scrollDiffY = Math.round(_options.velocityFn(_dynamicVelocity.y, _options.threshold) * _scrollIntentions.vertical);
        getSetElementScroll(_scrollableParent, 1, scrollDiffY);
    }
    if (isTopLevel) {
        _translateDragImageFn(scrollDiffX, scrollDiffY);
    }
    else {
        _translateDragImageFn(0, 0);
    }
    _scrollAnimationFrameId = null;
    if (updateScrollIntentions(_currentCoordinates, _scrollableParent, _options.threshold, _scrollIntentions, _dynamicVelocity)) {
        scheduleScrollAnimation();
    }
}
function updateScrollIntentions(currentCoordinates, scrollableParent, threshold, scrollIntentions, dynamicVelocity) {
    if (!currentCoordinates || !scrollableParent) {
        return false;
    }
    var scrollableParentBounds = {
        x: getElementViewportOffset(scrollableParent, 0),
        y: getElementViewportOffset(scrollableParent, 1),
        width: getElementViewportSize(scrollableParent, 0),
        height: getElementViewportSize(scrollableParent, 1),
        scrollX: getSetElementScroll(scrollableParent, 0),
        scrollY: getSetElementScroll(scrollableParent, 1),
        scrollWidth: scrollableParent.scrollWidth,
        scrollHeight: scrollableParent.scrollHeight
    };
    var currentCoordinatesOffset = {
        x: currentCoordinates.x - scrollableParentBounds.x,
        y: currentCoordinates.y - scrollableParentBounds.y
    };
    scrollIntentions.horizontal = determineScrollIntention(currentCoordinatesOffset.x, scrollableParentBounds.width, threshold);
    scrollIntentions.vertical = determineScrollIntention(currentCoordinatesOffset.y, scrollableParentBounds.height, threshold);
    if (scrollIntentions.horizontal && isScrollEndReached(0, scrollIntentions.horizontal, scrollableParentBounds)) {
        scrollIntentions.horizontal = 0;
    }
    else if (scrollIntentions.horizontal) {
        dynamicVelocity.x = determineDynamicVelocity(scrollIntentions.horizontal, currentCoordinatesOffset.x, scrollableParentBounds.width, threshold);
    }
    if (scrollIntentions.vertical && isScrollEndReached(1, scrollIntentions.vertical, scrollableParentBounds)) {
        scrollIntentions.vertical = 0;
    }
    else if (scrollIntentions.vertical) {
        dynamicVelocity.y = determineDynamicVelocity(scrollIntentions.vertical, currentCoordinatesOffset.y, scrollableParentBounds.height, threshold);
    }
    return !!(scrollIntentions.horizontal || scrollIntentions.vertical);
}
var scrollBehaviourDragImageTranslateOverride = handleDragImageTranslateOverride;

exports.scrollBehaviourDragImageTranslateOverride = scrollBehaviourDragImageTranslateOverride;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=scroll-behaviour.js.map


/***/ }),
/* 125 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var inspectSource = __webpack_require__(59);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(18);
var getOwnPropertyNamesModule = __webpack_require__(62);
var getOwnPropertySymbolsModule = __webpack_require__(65);
var anObject = __webpack_require__(4);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var aPossiblePrototype = __webpack_require__(130);

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(68);
var classof = __webpack_require__(69);

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(7);
var fails = __webpack_require__(2);
var objectKeys = __webpack_require__(48);
var getOwnPropertySymbolsModule = __webpack_require__(65);
var propertyIsEnumerableModule = __webpack_require__(56);
var toObject = __webpack_require__(9);
var IndexedObject = __webpack_require__(39);

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(22);
var $ = __webpack_require__(0);
var getBuiltIn = __webpack_require__(18);
var USE_NATIVE_URL = __webpack_require__(97);
var redefine = __webpack_require__(11);
var redefineAll = __webpack_require__(101);
var setToStringTag = __webpack_require__(23);
var createIteratorConstructor = __webpack_require__(91);
var InternalStateModule = __webpack_require__(17);
var anInstance = __webpack_require__(72);
var hasOwn = __webpack_require__(5);
var bind = __webpack_require__(29);
var classof = __webpack_require__(69);
var anObject = __webpack_require__(4);
var isObject = __webpack_require__(6);
var create = __webpack_require__(47);
var createPropertyDescriptor = __webpack_require__(20);
var getIterator = __webpack_require__(135);
var getIteratorMethod = __webpack_require__(52);
var wellKnownSymbol = __webpack_require__(1);

var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (hasOwn(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.appent` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!USE_NATIVE_URL && typeof $fetch == 'function' && typeof Headers == 'function') {
  $({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = create(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var getIteratorMethod = __webpack_require__(52);

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var IS_PURE = __webpack_require__(21);
var global = __webpack_require__(3);
var getBuiltIn = __webpack_require__(18);
var NativePromise = __webpack_require__(137);
var redefine = __webpack_require__(11);
var redefineAll = __webpack_require__(101);
var setToStringTag = __webpack_require__(23);
var setSpecies = __webpack_require__(138);
var isObject = __webpack_require__(6);
var aFunction = __webpack_require__(30);
var anInstance = __webpack_require__(72);
var classof = __webpack_require__(14);
var inspectSource = __webpack_require__(59);
var iterate = __webpack_require__(139);
var checkCorrectnessOfIteration = __webpack_require__(104);
var speciesConstructor = __webpack_require__(105);
var task = __webpack_require__(106).set;
var microtask = __webpack_require__(140);
var promiseResolve = __webpack_require__(141);
var hostReportErrors = __webpack_require__(142);
var newPromiseCapabilityModule = __webpack_require__(108);
var perform = __webpack_require__(143);
var InternalStateModule = __webpack_require__(17);
var isForced = __webpack_require__(85);
var wellKnownSymbol = __webpack_require__(1);
var V8_VERSION = __webpack_require__(74);

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);

module.exports = global.Promise;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(18);
var definePropertyModule = __webpack_require__(8);
var wellKnownSymbol = __webpack_require__(1);
var DESCRIPTORS = __webpack_require__(7);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var isArrayIteratorMethod = __webpack_require__(100);
var toLength = __webpack_require__(12);
var bind = __webpack_require__(29);
var getIteratorMethod = __webpack_require__(52);
var callWithSafeIterationClosing = __webpack_require__(99);

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var getOwnPropertyDescriptor = __webpack_require__(38).f;
var classof = __webpack_require__(14);
var macrotask = __webpack_require__(106).set;
var IS_IOS = __webpack_require__(107);

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !IS_IOS) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var isObject = __webpack_require__(6);
var newPromiseCapability = __webpack_require__(108);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),
/* 143 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(2);

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),
/* 145 */
/***/ (function(module, exports) {

// `SameValue` abstract operation
// https://tc39.github.io/ecma262/#sec-samevalue
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

/*! mobile-drag-drop 2.3.0-rc.1 | Copyright (c) 2019 Tim Ruffles | MIT License */
!function(t,i){ true?i(exports):undefined}(this,function(t){"use strict";var i="dnd-poly-",s=i+"snapback",n="dnd-poly-",h=n+"dragstart-pending",e=n+"dragstart-cancel",r=["none","copy","copyLink","copyMove","link","linkMove","move","all"],o=["none","copy","move","link"];var u=function(){var t=!1;try{var i=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",null,i)}catch(t){}return t}();function a(t){return t&&t.tagName}function c(t,i,s){void 0===s&&(s=!0),document.addEventListener(t,i,!!u&&{passive:s})}function f(t,i){document.removeEventListener(t,i)}function l(t,i,s,n){void 0===n&&(n=!1);var h=u?{passive:!0,capture:n}:n;return t.addEventListener(i,s,h),{off:function(){t.removeEventListener(i,s,h)}}}function d(t){return 0===t.length?0:t.reduce(function(t,i){return i+t},0)/t.length}function v(t,i){for(var s=0;s<t.changedTouches.length;s++){if(t.changedTouches[s].identifier===i)return!0}return!1}function p(t,i,s){for(var n=[],h=[],e=0;e<i.touches.length;e++){var r=i.touches[e];n.push(r[t+"X"]),h.push(r[t+"Y"])}s.x=d(n),s.y=d(h)}var g=["","-webkit-"];function m(t,i,s,n,h){void 0===h&&(h=!0);var e=i.x,r=i.y;n&&(e+=n.x,r+=n.y),h&&(e-=parseInt(t.offsetWidth,10)/2,r-=parseInt(t.offsetHeight,10)/2);for(var o="translate3d("+e+"px,"+r+"px, 0)",u=0;u<g.length;u++){var a=g[u]+"transform";t.style[a]=o+" "+s[u]}}var b=function(){function t(t,i){this.t=t,this.i=i,this.s=o[0]}return Object.defineProperty(t.prototype,"dropEffect",{get:function(){return this.s},set:function(t){0!==this.t.mode&&r.indexOf(t)>-1&&(this.s=t)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"types",{get:function(){if(0!==this.t.mode)return Object.freeze(this.t.types)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"effectAllowed",{get:function(){return this.t.effectAllowed},set:function(t){2===this.t.mode&&r.indexOf(t)>-1&&(this.t.effectAllowed=t)},enumerable:!0,configurable:!0}),t.prototype.setData=function(t,i){if(2===this.t.mode){if(t.indexOf(" ")>-1)throw new Error("illegal arg: type contains space");this.t.data[t]=i,-1===this.t.types.indexOf(t)&&this.t.types.push(t)}},t.prototype.getData=function(t){if(1===this.t.mode||2===this.t.mode)return this.t.data[t]||""},t.prototype.clearData=function(t){if(2===this.t.mode){if(t&&this.t.data[t]){delete this.t.data[t];var i=this.t.types.indexOf(t);return void(i>-1&&this.t.types.splice(i,1))}this.t.data={},this.t.types=[]}},t.prototype.setDragImage=function(t,i,s){2===this.t.mode&&this.i(t,i,s)},t}();function y(t,i){return t?t===r[0]?o[0]:0===t.indexOf(r[1])||t===r[7]?o[1]:0===t.indexOf(r[4])?o[3]:t===r[6]?o[2]:o[1]:3===i.nodeType&&"A"===i.tagName?o[3]:o[1]}function w(t,i,s,n,h,e,r){void 0===e&&(e=!0),void 0===r&&(r=null);var o=function(t,i,s,n,h,e,r){void 0===r&&(r=null);var o=i.changedTouches[0],u=new Event(s,{bubbles:!0,cancelable:n});u.dataTransfer=e,u.relatedTarget=r,u.screenX=o.screenX,u.screenY=o.screenY,u.clientX=o.clientX,u.clientY=o.clientY,u.pageX=o.pageX,u.pageY=o.pageY;var a=t.getBoundingClientRect();return u.offsetX=u.clientX-a.left,u.offsetY=u.clientY-a.top,u}(i,s,t,e,document.defaultView,h,r),u=!i.dispatchEvent(o);return n.mode=0,u}function x(t,i){if(!t||t===r[7])return i;if(i===o[1]){if(0===t.indexOf(o[1]))return o[1]}else if(i===o[3]){if(0===t.indexOf(o[3])||t.indexOf("Link")>-1)return o[3]}else if(i===o[2]&&(0===t.indexOf(o[2])||t.indexOf("Move")>-1))return o[2];return o[0]}var I,j=function(){function t(t,i,s,n){this.h=t,this.o=i,this.u=s,this.l=n,this.v=0,this.p=null,this.g=null,this.m=t,this.I=t.changedTouches[0],this.j=this.C.bind(this),this.S=this.k.bind(this),c("touchmove",this.j,!1),c("touchend",this.S,!1),c("touchcancel",this.S,!1)}return t.prototype.A=function(){var t=this;this.v=1,this.O=o[0],this.D={data:{},effectAllowed:void 0,mode:3,types:[]},this.M={x:null,y:null},this.F={x:null,y:null};var i=this.u;if(this.N=new b(this.D,function(s,n,h){i=s,"number"!=typeof n&&"number"!=typeof h||(t.P={x:n||0,y:h||0})}),this.D.mode=2,this.N.dropEffect=o[0],w("dragstart",this.u,this.m,this.D,this.N))return this.v=3,this.T(),!1;p("page",this.m,this.F);var s,n=this.o.dragImageSetup(i);if(this.L=(s=n,g.map(function(t){var i=s.style[t+"transform"];return i&&"none"!==i?i.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g,""):""})),n.style.position="absolute",n.style.left="0px",n.style.top="0px",n.style.zIndex="999999",n.classList.add("dnd-poly-drag-image"),n.classList.add("dnd-poly-icon"),this._=n,!this.P)if(this.o.dragImageOffset)this.P={x:this.o.dragImageOffset.x,y:this.o.dragImageOffset.y};else if(this.o.dragImageCenterOnTouch){var h=getComputedStyle(i);this.P={x:0-parseInt(h.marginLeft,10),y:0-parseInt(h.marginTop,10)}}else{var e=i.getBoundingClientRect();h=getComputedStyle(i);this.P={x:e.left-this.I.clientX-parseInt(h.marginLeft,10)+e.width/2,y:e.top-this.I.clientY-parseInt(h.marginTop,10)+e.height/2}}return m(this._,this.F,this.L,this.P,this.o.dragImageCenterOnTouch),document.body.appendChild(this._),this.V=window.setInterval(function(){t.X||(t.X=!0,t.Y(),t.X=!1)},this.o.iterationInterval),!0},t.prototype.T=function(){this.V&&(clearInterval(this.V),this.V=null),f("touchmove",this.j),f("touchend",this.S),f("touchcancel",this.S),this._&&(this._.parentNode.removeChild(this._),this._=null),this.l(this.o,this.m,this.v)},t.prototype.C=function(t){var i=this;if(!1!==v(t,this.I.identifier)){if(this.m=t,0===this.v){var s=void 0;if(this.o.dragStartConditionOverride)try{s=this.o.dragStartConditionOverride(t)}catch(t){s=!1}else s=1===t.touches.length;return s?void(!0===this.A()&&(this.h.preventDefault(),t.preventDefault())):void this.T()}if(t.preventDefault(),p("client",t,this.M),p("page",t,this.F),this.o.dragImageTranslateOverride)try{var n=!1;if(this.o.dragImageTranslateOverride(t,{x:this.M.x,y:this.M.y},this.p,function(t,s){i._&&(n=!0,i.M.x+=t,i.M.y+=s,i.F.x+=t,i.F.y+=s,m(i._,i.F,i.L,i.P,i.o.dragImageCenterOnTouch))}),n)return}catch(t){}m(this._,this.F,this.L,this.P,this.o.dragImageCenterOnTouch)}},t.prototype.k=function(t){if(!1!==v(t,this.I.identifier)){if(this.o.dragImageTranslateOverride)try{this.o.dragImageTranslateOverride(void 0,void 0,void 0,function(){})}catch(t){}0!==this.v?(t.preventDefault(),this.v="touchcancel"===t.type?3:2):this.T()}},t.prototype.Y=function(){var t=this,n=this.O;this.D.mode=3,this.N.dropEffect=o[0];var h=w("drag",this.u,this.m,this.D,this.N);if(h&&(this.O=o[0]),h||2===this.v||3===this.v)return this.q(this.v)?void function(t,i,n,h){var e=getComputedStyle(t);if("hidden"!==e.visibility&&"none"!==e.display){i.classList.add(s);var r=getComputedStyle(i),o=parseFloat(r.transitionDuration);if(isNaN(o)||0===o)h();else{var u=t.getBoundingClientRect(),a={x:u.left,y:u.top};a.x+=document.body.scrollLeft||document.documentElement.scrollLeft,a.y+=document.body.scrollTop||document.documentElement.scrollTop,a.x-=parseInt(e.marginLeft,10),a.y-=parseInt(e.marginTop,10);var c=parseFloat(r.transitionDelay),f=Math.round(1e3*(o+c));m(i,a,n,void 0,!1),setTimeout(h,f)}}else h()}(this.u,this._,this.L,function(){t.B()}):void this.B();var e=this.o.elementFromPoint(this.M.x,this.M.y),r=this.g;e!==this.p&&e!==this.g&&(this.p=e,null!==this.g&&(this.D.mode=3,this.N.dropEffect=o[0],w("dragexit",this.g,this.m,this.D,this.N,!1)),null===this.p?this.g=this.p:(this.D.mode=3,this.N.dropEffect=y(this.D.effectAllowed,this.u),w("dragenter",this.p,this.m,this.D,this.N)?(this.g=this.p,this.O=x(this.N.effectAllowed,this.N.dropEffect)):this.p!==document.body&&(this.g=document.body))),r!==this.g&&a(r)&&(this.D.mode=3,this.N.dropEffect=o[0],w("dragleave",r,this.m,this.D,this.N,!1,this.g)),a(this.g)&&(this.D.mode=3,this.N.dropEffect=y(this.D.effectAllowed,this.u),!1===w("dragover",this.g,this.m,this.D,this.N)?this.O=o[0]:this.O=x(this.N.effectAllowed,this.N.dropEffect)),n!==this.O&&this._.classList.remove(i+n);var u=i+this.O;this._.classList.add(u)},t.prototype.q=function(t){var i=this.O===o[0]||null===this.g||3===t;return i?a(this.g)&&(this.D.mode=3,this.N.dropEffect=o[0],w("dragleave",this.g,this.m,this.D,this.N,!1)):a(this.g)&&(this.D.mode=1,this.N.dropEffect=this.O,!0===w("drop",this.g,this.m,this.D,this.N)?this.O=this.N.dropEffect:this.O=o[0]),i},t.prototype.B=function(){this.D.mode=3,this.N.dropEffect=this.O,w("dragend",this.u,this.m,this.D,this.N,!1),this.v=2,this.T()},t}(),C={iterationInterval:150,tryFindDraggableTarget:function(t){var i=t.target;do{if(!1!==i.draggable){if(!0===i.draggable)return i;if(i.getAttribute&&"true"===i.getAttribute("draggable"))return i}}while((i=i.parentNode)&&i!==document.body)},dragImageSetup:function(t){var i=t.cloneNode(!0);return function t(i,s){if(1===i.nodeType){for(var n=getComputedStyle(i),h=0;h<n.length;h++){var e=n[h];s.style.setProperty(e,n.getPropertyValue(e),n.getPropertyPriority(e))}if(s.style.pointerEvents="none",s.removeAttribute("id"),s.removeAttribute("class"),s.removeAttribute("draggable"),"CANVAS"===s.nodeName){var r=i,o=s,u=r.getContext("2d").getImageData(0,0,r.width,r.height);o.getContext("2d").putImageData(u,0,0)}}if(i.hasChildNodes())for(h=0;h<i.childNodes.length;h++)t(i.childNodes[h],s.childNodes[h])}(t,i),i},elementFromPoint:function(t,i){return document.elementFromPoint(t,i)}};function S(t){if(!I){var i=C.tryFindDraggableTarget(t);if(i)try{I=new j(t,C,i,A)}catch(i){throw A(C,t,3),i}}}function k(t){var i=t.target,s=function(t){r.off(),o.off(),u.off(),a.off(),i&&i.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0})),clearTimeout(n)};i&&i.dispatchEvent(new CustomEvent(h,{bubbles:!0,cancelable:!0}));var n=window.setTimeout(function(){r.off(),o.off(),u.off(),a.off(),S(t)},C.holdToDrag),r=l(i,"touchend",s),o=l(i,"touchcancel",s),u=l(i,"touchmove",s),a=l(window,"scroll",s,!0)}function A(t,i,s){if(0===s&&t.defaultActionOverride)try{t.defaultActionOverride(i),i.defaultPrevented}catch(t){}I=null}t.polyfill=function(t){if(t&&Object.keys(t).forEach(function(i){C[i]=t[i]}),!C.forceApply){var i=(s={dragEvents:"ondragstart"in document.documentElement,draggable:"draggable"in document.documentElement,userAgentSupportingNativeDnD:void 0},n=!!window.chrome||/chrome/i.test(navigator.userAgent),s.userAgentSupportingNativeDnD=!(/iPad|iPhone|iPod|Android/.test(navigator.userAgent)||n&&"ontouchstart"in document.documentElement),s);if(i.userAgentSupportingNativeDnD&&i.draggable&&i.dragEvents)return!1}var s,n;return C.holdToDrag?c("touchstart",k,!1):c("touchstart",S,!1),!0},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.min.js.map

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./GameBoard.js": 113,
	"./Hand.js": 117,
	"./Match.js": 54,
	"./Popups.js": 78,
	"./Pretty.js": 76,
	"./RoomManager.js": 122,
	"./Sequence.js": 55,
	"./StateManager.js": 73,
	"./Tile.js": 24,
	"./Wall.js": 77,
	"./index.js": 79
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 147;

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var notARegExp = __webpack_require__(149);
var requireObjectCoercible = __webpack_require__(16);
var correctIsRegExpLogic = __webpack_require__(150);

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__(116);

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(1);

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var global = __webpack_require__(3);
var getBuiltIn = __webpack_require__(18);
var IS_PURE = __webpack_require__(21);
var DESCRIPTORS = __webpack_require__(7);
var NATIVE_SYMBOL = __webpack_require__(67);
var USE_SYMBOL_AS_UID = __webpack_require__(87);
var fails = __webpack_require__(2);
var has = __webpack_require__(5);
var isArray = __webpack_require__(44);
var isObject = __webpack_require__(6);
var anObject = __webpack_require__(4);
var toObject = __webpack_require__(9);
var toIndexedObject = __webpack_require__(13);
var toPrimitive = __webpack_require__(27);
var createPropertyDescriptor = __webpack_require__(20);
var nativeObjectCreate = __webpack_require__(47);
var objectKeys = __webpack_require__(48);
var getOwnPropertyNamesModule = __webpack_require__(62);
var getOwnPropertyNamesExternal = __webpack_require__(152);
var getOwnPropertySymbolsModule = __webpack_require__(65);
var getOwnPropertyDescriptorModule = __webpack_require__(38);
var definePropertyModule = __webpack_require__(8);
var propertyIsEnumerableModule = __webpack_require__(56);
var createNonEnumerableProperty = __webpack_require__(10);
var redefine = __webpack_require__(11);
var shared = __webpack_require__(60);
var sharedKey = __webpack_require__(40);
var hiddenKeys = __webpack_require__(41);
var uid = __webpack_require__(61);
var wellKnownSymbol = __webpack_require__(1);
var wrappedWellKnownSymbolModule = __webpack_require__(118);
var defineWellKnownSymbol = __webpack_require__(119);
var setToStringTag = __webpack_require__(23);
var InternalStateModule = __webpack_require__(17);
var $forEach = __webpack_require__(28).forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(13);
var nativeGetOwnPropertyNames = __webpack_require__(62).f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(0);
var DESCRIPTORS = __webpack_require__(7);
var global = __webpack_require__(3);
var has = __webpack_require__(5);
var isObject = __webpack_require__(6);
var defineProperty = __webpack_require__(8).f;
var copyConstructorProperties = __webpack_require__(82);

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(119);

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var $filter = __webpack_require__(28).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(33);
var arrayMethodUsesToLength = __webpack_require__(15);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var $findIndex = __webpack_require__(28).findIndex;
var addToUnscopables = __webpack_require__(46);
var arrayMethodUsesToLength = __webpack_require__(15);

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

var USES_TO_LENGTH = arrayMethodUsesToLength(FIND_INDEX);

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);
var from = __webpack_require__(98);
var checkCorrectnessOfIteration = __webpack_require__(104);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(7);
var defineProperty = __webpack_require__(8).f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);
var toObject = __webpack_require__(9);
var nativeKeys = __webpack_require__(48);
var fails = __webpack_require__(2);

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);
var fill = __webpack_require__(161);
var addToUnscopables = __webpack_require__(46);

// `Array.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
$({ target: 'Array', proto: true }, {
  fill: fill
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(43);
var toLength = __webpack_require__(12);

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(70).charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var IndexedObject = __webpack_require__(39);
var toIndexedObject = __webpack_require__(13);
var arrayMethodIsStrict = __webpack_require__(45);

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var $trim = __webpack_require__(165).trim;
var forcedStringTrimMethod = __webpack_require__(166);

// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(16);
var whitespaces = __webpack_require__(123);

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(2);
var whitespaces = __webpack_require__(123);

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map