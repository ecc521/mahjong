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
/******/ 	return __webpack_require__(__webpack_require__.s = 52);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(53)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var getOwnPropertyDescriptor = __webpack_require__(29).f;
var createNonEnumerableProperty = __webpack_require__(6);
var redefine = __webpack_require__(55);
var setGlobal = __webpack_require__(17);
var copyConstructorProperties = __webpack_require__(59);
var isForced = __webpack_require__(64);

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
/* 3 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(1);

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var definePropertyModule = __webpack_require__(7);
var createPropertyDescriptor = __webpack_require__(15);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var IE8_DOM_DEFINE = __webpack_require__(33);
var anObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(16);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(20);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var shared = __webpack_require__(38);
var has = __webpack_require__(4);
var uid = __webpack_require__(39);
var NATIVE_SYMBOL = __webpack_require__(45);
var USE_SYMBOL_AS_UID = __webpack_require__(66);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var fails = __webpack_require__(1);
var has = __webpack_require__(4);

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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(30);
var requireObjectCoercible = __webpack_require__(32);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(32);

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

function Tile() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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

    if (tile.type = this.type && tile.value === this.value) {
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

  this.isSequence = false;
  this.isPongOrKong = false;
  this.isPair = false;
}

module.exports = Tile;

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var createNonEnumerableProperty = __webpack_require__(6);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(61);
var global = __webpack_require__(0);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(20);

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
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
var isArray = __webpack_require__(24);
var wellKnownSymbol = __webpack_require__(9);

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(31);

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(16);
var definePropertyModule = __webpack_require__(7);
var createPropertyDescriptor = __webpack_require__(15);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(1);
var wellKnownSymbol = __webpack_require__(9);
var V8_VERSION = __webpack_require__(48);

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var $includes = __webpack_require__(41).includes;
var addToUnscopables = __webpack_require__(49);
var arrayMethodUsesToLength = __webpack_require__(10);

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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var forEach = __webpack_require__(42);

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var propertyIsEnumerableModule = __webpack_require__(54);
var createPropertyDescriptor = __webpack_require__(15);
var toIndexedObject = __webpack_require__(11);
var toPrimitive = __webpack_require__(16);
var has = __webpack_require__(4);
var IE8_DOM_DEFINE = __webpack_require__(33);

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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(1);
var classof = __webpack_require__(31);

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
/* 31 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var fails = __webpack_require__(1);
var createElement = __webpack_require__(34);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var isObject = __webpack_require__(3);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(36);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var setGlobal = __webpack_require__(17);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(38);
var uid = __webpack_require__(39);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(58);
var store = __webpack_require__(36);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 39 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(4);
var toIndexedObject = __webpack_require__(11);
var indexOf = __webpack_require__(41).indexOf;
var hiddenKeys = __webpack_require__(18);

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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(11);
var toLength = __webpack_require__(8);
var toAbsoluteIndex = __webpack_require__(21);

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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(43).forEach;
var arrayMethodIsStrict = __webpack_require__(46);
var arrayMethodUsesToLength = __webpack_require__(10);

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(65);
var IndexedObject = __webpack_require__(30);
var toObject = __webpack_require__(13);
var toLength = __webpack_require__(8);
var arraySpeciesCreate = __webpack_require__(23);

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
/* 44 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(1);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(1);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var isObject = __webpack_require__(3);
var isArray = __webpack_require__(24);
var toAbsoluteIndex = __webpack_require__(21);
var toLength = __webpack_require__(8);
var toIndexedObject = __webpack_require__(11);
var createProperty = __webpack_require__(25);
var wellKnownSymbol = __webpack_require__(9);
var arrayMethodHasSpeciesSupport = __webpack_require__(26);
var arrayMethodUsesToLength = __webpack_require__(10);

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var userAgent = __webpack_require__(67);

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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(9);
var create = __webpack_require__(73);
var definePropertyModule = __webpack_require__(7);

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var aFunction = __webpack_require__(44);
var toObject = __webpack_require__(13);
var fails = __webpack_require__(1);
var arrayMethodIsStrict = __webpack_require__(46);

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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);

function Pretty() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
  this.isSequence = false;
  this.isPongOrKong = false;
  this.isPair = false;
}

module.exports = Pretty;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28);

__webpack_require__(47);

__webpack_require__(68);

var Tile = __webpack_require__(14);

var Hand = __webpack_require__(70);

function createTopOrBottomHand(handId) {
  var hand = document.createElement("div");
  hand.id = handId;
  document.body.appendChild(hand);
  return hand;
}

function createLeftOrRightHand(handId, containerId) {
  var hand = createTopOrBottomHand(handId); //We will return the container for the tiles. A container is used for the left and right hands in order to vertically center the tiles.

  var container = document.createElement("div");
  container.id = containerId;
  hand.appendChild(container);
  return container;
} //For testing.


var tiles = new (__webpack_require__(80))().tiles;
console.log(tiles);
var handTiles = tiles.slice(-14);
var userHandElem = createTopOrBottomHand("userHand");
var userHandElemExposed = createTopOrBottomHand("userHandExposed");
var userHand = new Hand();
console.log(userHand); //userHand.sortTiles(handTiles)

handTiles.forEach(function (value) {
  userHand.add(value);
});
userHand.renderTiles(userHandElem, userHandExposed, true);
var leftHandTiles = tiles.slice(-28, -14);
var leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer");
var leftHand = new Hand();
leftHandTiles.forEach(function (value) {
  leftHand.add(value);
});
leftHand.renderTiles(leftHandContainer);
var rightHandTiles = tiles.slice(-42, -28);
var rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer");

function drawRightTile(tile) {
  var elem = document.createElement("img");
  elem.src = tile.imageUrl;
  rightHandContainer.appendChild(elem);
}

for (var i = 0; i < rightHandTiles.length; i++) {
  var rightHandTile = rightHandTiles[i];
  drawRightTile(rightHandTile);
}

var topHandTiles = tiles.slice(-56, -42);
var topHand = createTopOrBottomHand("topHand");

function drawTopTile(tile) {
  var elem = document.createElement("img");
  elem.src = tile.imageUrl;
  topHand.appendChild(elem);
}

for (var _i = 0; _i < topHandTiles.length; _i++) {
  var topHandTile = topHandTiles[_i]; //drawTopTile(topHandTile)

  drawTopTile(new Tile({
    faceDown: true
  }));
}

/***/ }),
/* 53 */
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
/* 54 */
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
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var createNonEnumerableProperty = __webpack_require__(6);
var has = __webpack_require__(4);
var setGlobal = __webpack_require__(17);
var inspectSource = __webpack_require__(35);
var InternalStateModule = __webpack_require__(56);

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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(57);
var global = __webpack_require__(0);
var isObject = __webpack_require__(3);
var createNonEnumerableProperty = __webpack_require__(6);
var objectHas = __webpack_require__(4);
var sharedKey = __webpack_require__(37);
var hiddenKeys = __webpack_require__(18);

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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var inspectSource = __webpack_require__(35);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(4);
var ownKeys = __webpack_require__(60);
var getOwnPropertyDescriptorModule = __webpack_require__(29);
var definePropertyModule = __webpack_require__(7);

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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(19);
var getOwnPropertyNamesModule = __webpack_require__(62);
var getOwnPropertySymbolsModule = __webpack_require__(63);
var anObject = __webpack_require__(12);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);

module.exports = global;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(40);
var enumBugKeys = __webpack_require__(22);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(1);

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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(44);

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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(45);

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(19);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var DOMIterables = __webpack_require__(69);
var forEach = __webpack_require__(42);
var createNonEnumerableProperty = __webpack_require__(6);

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
/* 69 */
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(71);

__webpack_require__(72);

__webpack_require__(47);

__webpack_require__(50);

__webpack_require__(77);

var Tile = __webpack_require__(14);

var Match = __webpack_require__(78);

var Sequence = __webpack_require__(79).Sequence;

var Pretty = __webpack_require__(51);

function Hand() {
  this.contents = [];

  this.add = function (obj) {
    //We will insert the tile where our sorting algorithm would find it most appropriate.
    //TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
    var newItemScore;

    if (obj instanceof Sequence) {
      newItemScore = getTileValue(obj.tiles[0]); //Use value of first tile in sequence.
    } else {
      newItemScore = getTileValue(obj);
    }

    for (var i = 0; i < this.contents.length; i++) {
      //Find where to insert this tile.
      var currentItem = this.contents[i];

      if (currentItem instanceof Sequence) {
        //Not quite sure how to handle this.
        currentItem = currentItem.tiles[2]; //Get the value using the last tile in sequence.
      }

      var currentScore = getTileValue(currentItem); //Value of the tile in that position

      if (newItemScore < currentScore) {
        this.contents.splice(i, 0, obj);
        return;
      }
    }

    this.contents.push(obj);
  };

  this.remove = function (obj) {
    var index = this.contents.findIndex(function (value) {
      return value === obj;
    });

    if (index) {
      this.contents.splice(index, 1);
    } else {
      throw obj + " does not exist in hand. ";
    }
  };

  function getTileValue(tile) {
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
    } else {
      console.error("Couldn't fully calculate value for " + tile);
    }

    return tileValue;
  }

  this.sortTiles = function (tiles) {
    tiles.sort(function (tile1, tile2) {
      return getTileValue(tile1) - getTileValue(tile2);
    });
  };

  this.renderTiles = function (handToRender, handForExposed, interactive) {
    //handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
    //dragstart - Optional. If passed, tiles can be dragged and dropped to reorder the hand.
    //dragstart does not apply for tiles in handForExposed, if it exists.
    function allowDrop(ev) {
      ev.preventDefault();
    }

    function dragstart(ev) {
      var randomClass = "randomClassForTransfer" + Math.pow(2, 53) * Math.random();
      ev.target.classList.add(randomClass);
      ev.dataTransfer.setData("randomClass", randomClass);
    }

    var drop = function drop(ev) {
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
      var currentTile = this.contents.splice(elem.tileIndex, 1)[0];

      if (targetIndex <= this.contents.length) {
        var newTargetIndex = this.contents.findIndex(function (tile) {
          return targetTile === tile;
        });
        this.contents.splice(newTargetIndex, 0, currentTile);
      } else {
        this.contents.push(currentTile);
      }

      this.renderTiles(handToRender, handForExposed, interactive); //Re-render.
    }.bind(this); //TODO: Use addEventListener, but make sure to avoid having multiple identical listeners.


    if (interactive) {
      handToRender.ondragover = allowDrop;
      handToRender.ondrop = drop;
    }

    while (handToRender.firstChild) {
      handToRender.firstChild.remove();
    } //Delete everything currently rendered in the hand.


    var unexposedTiles = [];
    var exposedTiles = [];

    for (var i = 0; i < this.contents.length; i++) {
      var item = this.contents[i];

      if (item instanceof Tile) {
        unexposedTiles.push(item);
      } else if (item instanceof Pretty) {
        exposedTiles.push(item);
      } else if (item instanceof Match || item instanceof Sequence) {
        var items = item.tiles.slice(0); //Clone, as we modify for kongs.

        if (item.exposed) {
          if (item instanceof Match && item.amount === 4) {
            //kong. Flip 1 tile.
            items[0] = new Tile({
              faceDown: true
            });
          }

          exposedTiles = tiles.concat(items);
        } else {
          if (item instanceof Match && item.amount === 4) {
            //In hand kong. Expose with 2 flipped tiles.
            items[0] = new Tile({
              faceDown: true
            });
            items[3] = new Tile({
              faceDown: true
            });
            exposedTiles.concat(items);
          } else {
            unexposedTiles = tiles.concat(items);
          }
        }
      } else {
        console.error("Unknown item " + item);
      }
    }

    var drawTiles = function drawTiles(tiles, exposed) {
      var _this = this;

      var _loop = function _loop(_i) {
        var tile = tiles[_i];
        var elem = document.createElement("img");
        elem.src = tile.imageUrl;

        if (exposed && handForExposed) {
          handForExposed.appendChild(elem);
        } else if (exposed) {
          handToRender.appendChild(elem);
        } else {
          if (interactive) {
            elem.draggable = true;
            elem.addEventListener("dragstart", dragstart);
            elem.tileIndex = _this.contents.findIndex(function (item) {
              return item === tile;
            });
          }

          handToRender.appendChild(elem);
        }
      };

      for (var _i = 0; _i < tiles.length; _i++) {
        _loop(_i);
      }
    }.bind(this);

    drawTiles(exposedTiles, true);
    drawTiles(unexposedTiles, false);
  };
}

module.exports = Hand;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var fails = __webpack_require__(1);
var isArray = __webpack_require__(24);
var isObject = __webpack_require__(3);
var toObject = __webpack_require__(13);
var toLength = __webpack_require__(8);
var createProperty = __webpack_require__(25);
var arraySpeciesCreate = __webpack_require__(23);
var arrayMethodHasSpeciesSupport = __webpack_require__(26);
var wellKnownSymbol = __webpack_require__(9);
var V8_VERSION = __webpack_require__(48);

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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var $findIndex = __webpack_require__(43).findIndex;
var addToUnscopables = __webpack_require__(49);
var arrayMethodUsesToLength = __webpack_require__(10);

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
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(12);
var defineProperties = __webpack_require__(74);
var enumBugKeys = __webpack_require__(22);
var hiddenKeys = __webpack_require__(18);
var html = __webpack_require__(76);
var documentCreateElement = __webpack_require__(34);
var sharedKey = __webpack_require__(37);

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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var definePropertyModule = __webpack_require__(7);
var anObject = __webpack_require__(12);
var objectKeys = __webpack_require__(75);

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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(40);
var enumBugKeys = __webpack_require__(22);

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(19);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var toAbsoluteIndex = __webpack_require__(21);
var toInteger = __webpack_require__(20);
var toLength = __webpack_require__(8);
var toObject = __webpack_require__(13);
var arraySpeciesCreate = __webpack_require__(23);
var createProperty = __webpack_require__(25);
var arrayMethodHasSpeciesSupport = __webpack_require__(26);
var arrayMethodUsesToLength = __webpack_require__(10);

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
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);

var Tile = __webpack_require__(14);

function Match() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (config.exposed === undefined) {
    throw "Must specify either true or false for config.exposed. ";
  }

  if (config.amount < 2 || config.amount > 4) {
    throw "config.mount must be either 2, 3, or 4. ";
  }

  this.type = config.type;
  this.value = config.value;
  this.amount = config.amount;
  this.exposed = config.exposed;

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


    if (!exposed) {
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
      var arr = [];

      for (var i = 0; i < this.amount; i++) {
        arr.push(new Tile({
          value: this.value,
          amount: this.amount
        }));
      }

      return arr;
    }
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
  this.isSequence = false;
}

function isValidMatch(tiles) {
  //Confirm that the tiles all match.
  for (var i = 0; i < tiles.length; i++) {
    if (!tiles[0].matches(tiles[i])) {
      return false;
    }
  }

  return true;
}

module.exports = {
  Match: Match,
  isValidMatch: isValidMatch
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);

__webpack_require__(50);

function Sequence() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

  this.tiles = config.tile; //Sort the sequence.

  this.tiles = this.tiles.sort(function (tile1, tile2) {
    return tile1.value - tile2.value;
  });
  this.exposed = exposed;
  this.isSequence = true;
  this.isPongOrKong = false;
  this.isPair = false;
}

function isValidSequence(tiles) {
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

module.exports = {
  Sequence: Sequence,
  isValidSequence: isValidSequence
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28);

var Tile = __webpack_require__(14);

var Pretty = __webpack_require__(51);

function Wall() {
  var _this = this;

  this.tiles = [];

  this.drawFirst = function () {
    return this.tiles.pop();
  };

  this.drawLast = function () {
    return this.tiles.shift();
  }; //Time to add the tiles to the deck...


  var _loop = function _loop(i) {
    for (var c = 0; c < 4; c++) {
      ["bamboo", "character", "circle"].forEach(function (type) {
        _this.tiles.push(new Tile({
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
    for (var _i = 0; _i < 4; _i++) {
      _this.tiles.push(new Tile({
        type: "dragon",
        value: value
      }));
    }
  });
  ["north", "south", "east", "west"].forEach(function (value) {
    for (var _i2 = 0; _i2 < 4; _i2++) {
      _this.tiles.push(new Tile({
        type: "wind",
        value: value
      }));
    }
  });
  [false, true].forEach(function (isSeason) {
    for (var _i3 = 1; _i3 <= 4; _i3++) {
      _this.tiles.push(new Pretty({
        value: _i3,
        seasonOrFlower: isSeason ? "season" : "flower"
      }));
    }
  }); //Randomly mix the tiles.

  function shuffleArray(array) {
    //Durstenfeld shuffle
    for (var _i4 = array.length - 1; _i4 > 0; _i4--) {
      var j = Math.floor(Math.random() * (_i4 + 1));
      var _ref = [array[j], array[_i4]];
      array[_i4] = _ref[0];
      array[j] = _ref[1];
    }
  }

  shuffleArray(this.tiles);
}

module.exports = Wall;

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map