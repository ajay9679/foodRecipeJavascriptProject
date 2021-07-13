// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
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

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

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
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
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
      define(genFun, toStringTagSymbol, "GeneratorFunction");
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

  define(Gp, toStringTagSymbol, "Generator");

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
  typeof module === "object" ? module.exports : {}
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

},{}],"src/js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODAL_CLOSE_SEC = exports.KEY = exports.RES_PER_PAGE = exports.TIMEOUT_SEC = exports.API_URL = void 0;
var API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes/";
exports.API_URL = API_URL;
var TIMEOUT_SEC = 10;
exports.TIMEOUT_SEC = TIMEOUT_SEC;
var RES_PER_PAGE = 10;
exports.RES_PER_PAGE = RES_PER_PAGE;
var KEY = '366f4619-8643-4a27-8352-c2bca01831fc';
exports.KEY = KEY;
var MODAL_CLOSE_SEC = 2.5;
exports.MODAL_CLOSE_SEC = MODAL_CLOSE_SEC;
},{}],"src/js/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AJAX = void 0;

var _config = require("./config.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var timeout = function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request take too long! Timeout after ".concat(s, " second")));
    }, s * 1000);
  });
};
/* ================================ */

/* THIS CODE HAS LOTS OF REPETITION
/* ================================ */

/*
export const getJSON = async function(url){
	try{
		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
		// const res = await fetch(url);
		const data = await res.json();
		if(!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	}catch(err){
		console.error(err);
		throw err;
	}
}

export const sendJSON = async function(url, uploadData){
	try{
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		// const res = await fetch(url);
		const data = await res.json();
		if(!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	}catch(err){
		console.error(err);
		throw err;
	}
}
*/


var AJAX =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url) {
    var uploadData,
        fetchPro,
        res,
        data,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            uploadData = _args.length > 1 && _args[1] !== undefined ? _args[1] : undefined;
            _context.prev = 1;
            fetchPro = uploadData ? fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(uploadData)
            }) : fetch(url);
            _context.next = 5;
            return Promise.race([fetchPro, timeout(_config.TIMEOUT_SEC)]);

          case 5:
            res = _context.sent;
            _context.next = 8;
            return res.json();

          case 8:
            data = _context.sent;

            if (res.ok) {
              _context.next = 11;
              break;
            }

            throw new Error("".concat(data.message, " (").concat(res.status, ")"));

          case 11:
            return _context.abrupt("return", data);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);
            throw _context.t0;

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 14]]);
  }));

  return function AJAX(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.AJAX = AJAX;
},{"./config.js":"src/js/config.js"}],"src/js/model.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadRecipe = exports.deleteBookmark = exports.addBookmark = exports.updateServings = exports.getSearchResultsPage = exports.loadSearchResults = exports.loadRecipe = exports.state = void 0;

var _config = require("./config.js");

var _helpers = require("./helpers.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import { getJSON, sendJSON } 			from './helpers.js';
var state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: _config.RES_PER_PAGE
  },
  bookmarks: []
};
/* ================================ */

/* CREATE RECIPE OBJECT
/* ================================ */

exports.state = state;

var createRecipeObject = function createRecipeObject(data) {
  var recipe = data.data.recipe;
  return _objectSpread({
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients
  }, recipe.key && {
    key: recipe.key
  });
};
/* ================================ */

/* LOAD RECIPE
/* ================================ */


var loadRecipe =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(id) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _helpers.AJAX)("".concat(_config.API_URL).concat(id, "?key=").concat(_config.KEY));

          case 3:
            data = _context.sent;
            console.log(data);
            state.recipe = createRecipeObject(data);
            if (state.bookmarks.some(function (bookmark) {
              return bookmark.id === id;
            })) state.recipe.bookmarked = true;else state.recipe.bookmarked = false;
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0.message);
            throw _context.t0;

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function loadRecipe(_x) {
    return _ref.apply(this, arguments);
  };
}();
/* ================================ */

/* LOAD SEARCH RESULTS
/* ================================ */


exports.loadRecipe = loadRecipe;

var loadSearchResults =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(query) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            state.search.query = query;
            _context2.next = 4;
            return (0, _helpers.AJAX)("".concat(_config.API_URL, "?search=").concat(query, "&key=").concat(_config.KEY));

          case 4:
            data = _context2.sent;
            state.search.results = data.data.recipes.map(function (rec) {
              return _objectSpread({
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url
              }, rec.key && {
                key: rec.key
              });
            });
            state.search.page = 1;
            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0.message);
            throw _context2.t0;

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function loadSearchResults(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
/* ================================ */

/* GET SEARCH RESULT PAGE NO. (1-10)
/* ================================ */


exports.loadSearchResults = loadSearchResults;

var getSearchResultsPage = function getSearchResultsPage() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.search.page;
  state.search.page = page;
  var start = (page - 1) * state.search.resultsPerPage; // 0

  var end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};
/* ================================ */

/* UPDATE SERVINGS
/* ================================ */


exports.getSearchResultsPage = getSearchResultsPage;

var updateServings = function updateServings(newServings) {
  state.recipe.ingredients.forEach(function (ing) {
    return ing.quantity = ing.quantity * newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
/* ================================ */

/* PERSIST BOOKMARK
/* ================================ */


exports.updateServings = updateServings;

var persistBookmarks = function persistBookmarks(recipe) {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
/* ================================ */

/* ADD BOOKMARK
/* ================================ */


var addBookmark = function addBookmark(recipe) {
  // ADD BOOKMARK
  state.bookmarks.push(recipe); // MARK CURRENT RECIPE AS BOOKMARK

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; // STORE INTO LOCAL STORAGE

  persistBookmarks();
};
/* ================================ */

/* DELETE BOOKMARK
/* ================================ */


exports.addBookmark = addBookmark;

var deleteBookmark = function deleteBookmark(id) {
  var index = state.bookmarks.findIndex(function (el) {
    return el.id === id;
  }); //if condition is true then index will be return

  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false; //STORE INTO LOCAL STORAGE

  persistBookmarks();
};

exports.deleteBookmark = deleteBookmark;

var init = function init() {
  var storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
/* ================================ */

/* UPLOAD RECIPE
/* ================================ */


var uploadRecipe =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(newRecipe) {
    var ingredients, recipe, data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            // console.log(newRecipe)
            ingredients = Object.entries(newRecipe).filter(function (entry) {
              return entry[0].startsWith('ingredient') && entry[1] !== '';
            }).map(function (ing) {
              var ingArr = ing[1].replaceAll(' ', '').split(',');
              if (ingArr.length !== 3) throw new Error('Wrong ingredient format...');

              var _ingArr = _slicedToArray(ingArr, 3),
                  quantity = _ingArr[0],
                  unit = _ingArr[1],
                  description = _ingArr[2];

              return {
                quantity: quantity ? +quantity : null,
                unit: unit,
                description: description
              };
            });
            recipe = {
              title: newRecipe.title,
              source_url: newRecipe.sourceUrl,
              image_url: newRecipe.image,
              publisher: newRecipe.publisher,
              cooking_time: +newRecipe.cookingTime,
              servings: +newRecipe.servings,
              ingredients: ingredients
            };
            _context3.next = 5;
            return (0, _helpers.AJAX)("".concat(_config.API_URL, "?key=").concat(_config.KEY), recipe);

          case 5:
            data = _context3.sent;
            console.log(data);
            state.recipe = createRecipeObject(data);
            addBookmark(state.recipe);
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 11]]);
  }));

  return function uploadRecipe(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.uploadRecipe = uploadRecipe;
init();
},{"./config.js":"src/js/config.js","./helpers.js":"src/js/helpers.js"}],"src/img/icons.svg":[function(require,module,exports) {
module.exports = "/icons.ae3c38d5.svg";
},{}],"node_modules/fractional/index.js":[function(require,module,exports) {
/*
fraction.js
A Javascript fraction library.

Copyright (c) 2009  Erik Garrison <erik@hypervolu.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


/* Fractions */
/* 
 *
 * Fraction objects are comprised of a numerator and a denomenator.  These
 * values can be accessed at fraction.numerator and fraction.denomenator.
 *
 * Fractions are always returned and stored in lowest-form normalized format.
 * This is accomplished via Fraction.normalize.
 *
 * The following mathematical operations on fractions are supported:
 *
 * Fraction.equals
 * Fraction.add
 * Fraction.subtract
 * Fraction.multiply
 * Fraction.divide
 *
 * These operations accept both numbers and fraction objects.  (Best results
 * are guaranteed when the input is a fraction object.)  They all return a new
 * Fraction object.
 *
 * Usage:
 *
 * TODO
 *
 */

/*
 * The Fraction constructor takes one of:
 *   an explicit numerator (integer) and denominator (integer),
 *   a string representation of the fraction (string),
 *   or a floating-point number (float)
 *
 * These initialization methods are provided for convenience.  Because of
 * rounding issues the best results will be given when the fraction is
 * constructed from an explicit integer numerator and denomenator, and not a
 * decimal number.
 *
 *
 * e.g. new Fraction(1, 2) --> 1/2
 *      new Fraction('1/2') --> 1/2
 *      new Fraction('2 3/4') --> 11/4  (prints as 2 3/4)
 *
 */
Fraction = function(numerator, denominator)
{
    /* double argument invocation */
    if (typeof numerator !== 'undefined' && denominator) {
        if (typeof(numerator) === 'number' && typeof(denominator) === 'number') {
            this.numerator = numerator;
            this.denominator = denominator;
        } else if (typeof(numerator) === 'string' && typeof(denominator) === 'string') {
            // what are they?
            // hmm....
            // assume they are ints?
            this.numerator = parseInt(numerator);
            this.denominator = parseInt(denominator);
        }
    /* single-argument invocation */
    } else if (typeof denominator === 'undefined') {
        num = numerator; // swap variable names for legibility
        if (typeof(num) === 'number') {  // just a straight number init
            this.numerator = num;
            this.denominator = 1;
        } else if (typeof(num) === 'string') {
            var a, b;  // hold the first and second part of the fraction, e.g. a = '1' and b = '2/3' in 1 2/3
                       // or a = '2/3' and b = undefined if we are just passed a single-part number
            var arr = num.split(' ')
            if (arr[0]) a = arr[0]
            if (arr[1]) b = arr[1]
            /* compound fraction e.g. 'A B/C' */
            //  if a is an integer ...
            if (a % 1 === 0 && b && b.match('/')) {
                return (new Fraction(a)).add(new Fraction(b));
            } else if (a && !b) {
                /* simple fraction e.g. 'A/B' */
                if (typeof(a) === 'string' && a.match('/')) {
                    // it's not a whole number... it's actually a fraction without a whole part written
                    var f = a.split('/');
                    this.numerator = f[0]; this.denominator = f[1];
                /* string floating point */
                } else if (typeof(a) === 'string' && a.match('\.')) {
                    return new Fraction(parseFloat(a));
                /* whole number e.g. 'A' */
                } else { // just passed a whole number as a string
                    this.numerator = parseInt(a);
                    this.denominator = 1;
                }
            } else {
                return undefined; // could not parse
            }
        }
    }
    this.normalize();
}


Fraction.prototype.clone = function()
{
    return new Fraction(this.numerator, this.denominator);
}


/* pretty-printer, converts fractions into whole numbers and fractions */
Fraction.prototype.toString = function()
{
    if (this.denominator==='NaN') return 'NaN'
    var wholepart = (this.numerator/this.denominator>0) ?
      Math.floor(this.numerator / this.denominator) :
      Math.ceil(this.numerator / this.denominator)
    var numerator = this.numerator % this.denominator 
    var denominator = this.denominator;
    var result = []; 
    if (wholepart != 0)  
        result.push(wholepart);
    if (numerator != 0)  
        result.push(((wholepart===0) ? numerator : Math.abs(numerator)) + '/' + denominator);
    return result.length > 0 ? result.join(' ') : 0;
}


/* destructively rescale the fraction by some integral factor */
Fraction.prototype.rescale = function(factor)
{
    this.numerator *= factor;
    this.denominator *= factor;
    return this;
}


Fraction.prototype.add = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction) {
        b = b.clone();
    } else {
        b = new Fraction(b);
    }
    td = a.denominator;
    a.rescale(b.denominator);
    b.rescale(td);

    a.numerator += b.numerator;

    return a.normalize();
}


Fraction.prototype.subtract = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction) {
        b = b.clone();  // we scale our argument destructively, so clone
    } else {
        b = new Fraction(b);
    }
    td = a.denominator;
    a.rescale(b.denominator);
    b.rescale(td);

    a.numerator -= b.numerator;

    return a.normalize();
}


Fraction.prototype.multiply = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction)
    {
        a.numerator *= b.numerator;
        a.denominator *= b.denominator;
    } else if (typeof b === 'number') {
        a.numerator *= b;
    } else {
        return a.multiply(new Fraction(b));
    }
    return a.normalize();
}

Fraction.prototype.divide = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction)
    {
        a.numerator *= b.denominator;
        a.denominator *= b.numerator;
    } else if (typeof b === 'number') {
        a.denominator *= b;
    } else {
        return a.divide(new Fraction(b));
    }
    return a.normalize();
}

Fraction.prototype.equals = function(b)
{
    if (!(b instanceof Fraction)) {
        b = new Fraction(b);
    }
    // fractions that are equal should have equal normalized forms
    var a = this.clone().normalize();
    var b = b.clone().normalize();
    return (a.numerator === b.numerator && a.denominator === b.denominator);
}


/* Utility functions */

/* Destructively normalize the fraction to its smallest representation. 
 * e.g. 4/16 -> 1/4, 14/28 -> 1/2, etc.
 * This is called after all math ops.
 */
Fraction.prototype.normalize = (function()
{

    var isFloat = function(n)
    {
        return (typeof(n) === 'number' && 
                ((n > 0 && n % 1 > 0 && n % 1 < 1) || 
                 (n < 0 && n % -1 < 0 && n % -1 > -1))
               );
    }

    var roundToPlaces = function(n, places) 
    {
        if (!places) {
            return Math.round(n);
        } else {
            var scalar = Math.pow(10, places);
            return Math.round(n*scalar)/scalar;
        }
    }
        
    return (function() {

        // XXX hackish.  Is there a better way to address this issue?
        //
        /* first check if we have decimals, and if we do eliminate them
         * multiply by the 10 ^ number of decimal places in the number
         * round the number to nine decimal places
         * to avoid js floating point funnies
         */
        if (isFloat(this.denominator)) {
            var rounded = roundToPlaces(this.denominator, 9);
            var scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
            this.denominator = Math.round(this.denominator * scaleup); // this !!! should be a whole number
            //this.numerator *= scaleup;
            this.numerator *= scaleup;
        } 
        if (isFloat(this.numerator)) {
            var rounded = roundToPlaces(this.numerator, 9);
            var scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
            this.numerator = Math.round(this.numerator * scaleup); // this !!! should be a whole number
            //this.numerator *= scaleup;
            this.denominator *= scaleup;
        }
        var gcf = Fraction.gcf(this.numerator, this.denominator);
        this.numerator /= gcf;
        this.denominator /= gcf;
        if ((this.numerator < 0 && this.denominator < 0) || (this.numerator > 0 && this.denominator < 0)) {
            this.numerator *= -1;
            this.denominator *= -1;
        }
        return this;
    });

})();


/* Takes two numbers and returns their greatest common factor.
 */
Fraction.gcf = function(a, b)
{

    var common_factors = [];
    var fa = Fraction.primeFactors(a);
    var fb = Fraction.primeFactors(b);
    // for each factor in fa
    // if it's also in fb
    // put it into the common factors
    fa.forEach(function (factor) 
    { 
        var i = fb.indexOf(factor);
        if (i >= 0) {
            common_factors.push(factor);
            fb.splice(i,1); // remove from fb
        }
    });

    if (common_factors.length === 0)
        return 1;

    var gcf = (function() {
        var r = common_factors[0];
        var i;
        for (i=1;i<common_factors.length;i++)
        {
            r = r * common_factors[i];
        }
        return r;
    })();

    return gcf;

};


// Adapted from: 
// http://www.btinternet.com/~se16/js/factor.htm
Fraction.primeFactors = function(n) 
{

    var num = Math.abs(n);
    var factors = [];
    var _factor = 2;  // first potential prime factor

    while (_factor * _factor <= num)  // should we keep looking for factors?
    {      
      if (num % _factor === 0)  // this is a factor
        { 
            factors.push(_factor);  // so keep it
            num = num/_factor;  // and divide our search point by it
        }
        else
        {
            _factor++;  // and increment
        }
    }

    if (num != 1)                    // If there is anything left at the end...
    {                                // ...this must be the last prime factor
        factors.push(num);           //    so it too should be recorded
    }

    return factors;                  // Return the prime factors
}

module.exports.Fraction = Fraction

},{}],"src/js/views/view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var View =
/*#__PURE__*/
function () {
  function View() {
    _classCallCheck(this, View);

    _defineProperty(this, "_data", void 0);

    _defineProperty(this, "_message", '');

    _defineProperty(this, "_errorMessage", 'We could not found recipe!!! Please try again.');

    _defineProperty(this, "_parentElement", document.querySelector('.recipe'));
  }

  _createClass(View, [{
    key: "render",
    value:
    /**
    * Render the received object to the DOM.
    * @param {Object | Object[]} data - The data to be rendered (e.g. recipe)
    * @param {boolean} [render=true] - If false, create markup string instead of rendering to the DOM.
    * @returns {undefined | string} - A markup string is returned if render=false.
    * @this {Object} - View instance. 
    */
    function render(data) {
      var _render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!data || Array.isArray(data) && data.length === 0) return this.renderError();
      this._data = data;

      var markup = this._generateMarkup();

      if (!_render) return markup;

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    /**
    * Update the received object to the DOM.
    * @param {Object | Object[]} data - The data to be updated (e.g. recipe)
    */

  }, {
    key: "update",
    value: function update(data) {
      if (!data || Array.isArray(data) && data.length === 0) return this.renderError();
      this._data = data;

      var newMarkup = this._generateMarkup();

      var newDOM = document.createRange().createContextualFragment(newMarkup);
      var newElements = newDOM.querySelectorAll('*');

      var curElements = this._parentElement.querySelectorAll('*');

      newElements.forEach(function (newEl, i) {
        var curEl = curElements[i];
        if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') curEl.textContent = newEl.textContent;
        if (!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(function (attr) {
          return curEl.setAttribute(attr.name, attr.value);
        });
      });
    }
  }, {
    key: "_clear",
    value: function _clear() {
      this._parentElement.innerHTML = '';
    }
  }, {
    key: "renderSpinner",
    value: function renderSpinner() {
      var markup = "\n\t\t\t<div class=\"spinner\">\n\t    \t\t<svg>\n\t    \t\t\t<use href=\"".concat(_icons.default, "#icon-loader\"></use>\n\t    \t\t</svg>\n\t    \t</div>\n\t\t");

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }, {
    key: "renderError",
    value: function renderError() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._errorMessage;
      var markup = "\n\t\t\t<div class=\"error\">\n\t\t\t\t<div>\n\t\t\t\t\t<svg>\n\t\t\t\t\t\t<use href=\"".concat(_icons.default, "#icon-alert-triangle\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t\t<p>").concat(message, "</p>\n\t\t\t</div>\n\t\t");

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }, {
    key: "renderMessage",
    value: function renderMessage() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._message;
      var markup = "\n\t\t\t<div class=\"message\">\n\t\t\t\t<div>\n\t\t\t\t\t<svg>\n\t\t\t\t\t\t<use href=\"".concat(_icons.default, "#icon-smile\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t\t<p>").concat(message, "</p>\n\t\t\t</div>\n\t\t");

      this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }]);

  return View;
}();

exports.default = View;
},{"../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/recipeView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

var _fractional = require("fractional");

var _view = _interopRequireDefault(require("./view.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RecipeView =
/*#__PURE__*/
function (_View) {
  _inherits(RecipeView, _View);

  var _super = _createSuper(RecipeView);

  function RecipeView() {
    var _this;

    _classCallCheck(this, RecipeView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.recipe'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not found recipe!!! Please try again.');

    return _this;
  }

  _createClass(RecipeView, [{
    key: "addHandlerRender",
    value: function addHandlerRender(handler) {
      // LOTS OF REPITION HERE

      /*window.addEventListener('hashchange', controlRecipes);
      window.addEventListener('load', controlRecipes);*/
      var arr = ['hashchange', 'load'];
      arr.forEach(function (ev) {
        return window.addEventListener(ev, handler);
      });
    }
  }, {
    key: "addHandlerUpdateServings",
    value: function addHandlerUpdateServings(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn--update-servings');
        if (!btn) return;
        var updateTo = btn.dataset.updateTo;
        if (+updateTo > 0) handler(+updateTo);
      });
    }
  }, {
    key: "addHandlerAddBookmark",
    value: function addHandlerAddBookmark(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn--bookmark');
        if (!btn) return;
        handler();
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      return "\n\t\t\t<figure class=\"recipe__fig\">\n\t\t\t\t<img src=\"".concat(this._data.image, "\" alt=\"").concat(this._data.title, "\" class=\"recipe__img\" />\n\t\t\t\t<h1 class=\"recipe__title\">\n\t\t\t\t\t<span>").concat(this._data.title, "</span>\n\t\t\t\t</h1>\n\t\t\t</figure>\n\t\t\t\n\t\t\t<div class=\"recipe__details\">\n\t\t\t\t<div class=\"recipe__info\">\n\t\t\t\t\t<svg class=\"recipe__info-icon\">\n\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-clock\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span class=\"recipe__info-data recipe__info-data--minutes\">").concat(this._data.cookingTime, "</span>\n\t\t\t\t\t<span class=\"recipe__info-text\">minutes</span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"recipe__info\">\n\t\t\t\t\t<svg class=\"recipe__info-icon\">\n\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-users\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span class=\"recipe__info-data recipe__info-data--people\">").concat(this._data.servings, "</span>\n\t\t\t\t\t<span class=\"recipe__info-text\">servings</span>\n\n\t\t\t\t\t<div class=\"recipe__info-buttons\">\n\t\t\t\t\t\t<button class=\"btn--tiny btn--update-servings\" data-update-to=").concat(this._data.servings - 1, ">\n\t\t\t\t\t\t\t<svg>\n\t\t\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-minus-circle\"></use>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class=\"btn--tiny btn--update-servings\" data-update-to=").concat(this._data.servings + 1, ">\n\t\t\t\t\t\t\t<svg>\n\t\t\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-plus-circle\"></use>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"recipe__user-generated ").concat(this._data.key ? '' : 'hidden', "\">\n\t\t\t\t\t<svg>\n\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-user\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t\t<button class=\"btn--round btn--bookmark\">\n\t\t\t\t\t<svg class=\"\">\n\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-bookmark").concat(this._data.bookmarked ? '-fill' : '', "\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t</button>\n\t\t\t</div>\n\n\t\t\t<div class=\"recipe__ingredients\">\n\t\t\t\t<h2 class=\"heading--2\">Recipe ingredients</h2>\n\t\t\t\t<ul class=\"recipe__ingredient-list\">\n\t\t\t\t\t").concat(this._data.ingredients.map(this._generateMarkupIngredients).join(''), "\n\t\t\t\t</ul>\n\t\t\t</div>\n\n\t\t\t<div class=\"recipe__directions\">\n\t\t\t\t<h2 class=\"heading--2\">How to cook it</h2>\n\t\t\t\t<p class=\"recipe__directions-text\">\n\t\t\t\t\tThis recipe was carefully designed and tested by\n\t\t\t\t\t<span class=\"recipe__publisher\">").concat(this._data.publisher, "</span>. Please check out\n\t      directions at their website.\n\t      \t\t</p>\n\t      \t\t<a class=\"btn--small recipe__btn\" href=\"").concat(this._data.sourceUrl, "\" target=\"_blank\">\n\t      \t\t\t<span>Directions</span>\n\t      \t\t\t<svg class=\"search__icon\">\n\t      \t\t\t\t<use href=\"").concat(_icons.default, "#icon-arrow-right\"></use>\n\t      \t\t\t</svg>\n\t      \t\t</a>\n\t      \t</div>\n\t    ");
    }
  }, {
    key: "_generateMarkupIngredients",
    value: function _generateMarkupIngredients(ing) {
      return "\n\t\t\t<li class=\"recipe__ingredient\">\n\t\t\t\t<svg class=\"recipe__icon\">\n\t\t\t\t\t<use href=\"".concat(_icons.default, "#icon-check\"></use>\n\t\t\t\t</svg>\n\t\t\t\t<div class=\"recipe__quantity\">").concat(ing.quantity ? new _fractional.Fraction(ing.quantity).toString() : '', "</div>\n\t\t\t\t<div class=\"recipe__description\">\n\t\t\t\t\t<span class=\"recipe__unit\">").concat(ing.unit, "</span>\n\t\t\t\t\t").concat(ing.description, "\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t");
    }
  }]);

  return RecipeView;
}(_view.default);

var _default = new RecipeView();

exports.default = _default;
},{"../../img/icons.svg":"src/img/icons.svg","fractional":"node_modules/fractional/index.js","./view.js":"src/js/views/view.js"}],"src/js/views/searchView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchView =
/*#__PURE__*/
function () {
  function SearchView() {
    _classCallCheck(this, SearchView);

    _defineProperty(this, "_parentEl", document.querySelector('.search'));
  }

  _createClass(SearchView, [{
    key: "getQuery",
    value: function getQuery() {
      var query = this._parentEl.querySelector('.search__field').value;

      this._clearInput();

      return query;
    }
  }, {
    key: "_clearInput",
    value: function _clearInput() {
      this._parentEl.querySelector('.search__field').value = '';
    }
  }, {
    key: "addHandlerSearch",
    value: function addHandlerSearch(handler) {
      this._parentEl.addEventListener('submit', function (e) {
        e.preventDefault();
        handler();
      });
    }
  }]);

  return SearchView;
}();

var _default = new SearchView();

exports.default = _default;
},{}],"src/js/views/previewView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("./view.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PreviewView =
/*#__PURE__*/
function (_View) {
  _inherits(PreviewView, _View);

  var _super = _createSuper(PreviewView);

  function PreviewView() {
    var _this;

    _classCallCheck(this, PreviewView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", '');

    return _this;
  }

  _createClass(PreviewView, [{
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var id = window.location.hash.slice(1);
      return "\n\t\t\t<li class=\"preview\">\n\t\t\t\t<a class=\"preview__link ".concat(this._data.id === id ? 'preview__link--active' : '', "\" href=\"#").concat(this._data.id, "\">\n\t\t\t\t\t<figure class=\"preview__fig\">\n\t\t\t\t\t\t<img src=\"").concat(this._data.image, "\" alt=\"").concat(this._data.title, "\" />\n\t\t\t\t\t</figure>\n\t\t\t\t\t<div class=\"preview__data\">\n\t\t\t\t\t\t<h4 class=\"preview__title\">").concat(this._data.title, "</h4>\n\t\t\t\t\t\t<p class=\"preview__publisher\">").concat(this._data.publisher, "</p>\n\t\t\t\t\t\t<div class=\"preview__user-generated ").concat(this._data.key ? '' : 'hidden', "\">\n\t\t\t\t\t\t\t<svg>\n\t\t\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-user\"></use>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t");
    }
  }]);

  return PreviewView;
}(_view.default);

var _default = new PreviewView();

exports.default = _default;
},{"./view.js":"src/js/views/view.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/resultsView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("./view.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

var _previewView = _interopRequireDefault(require("./previewView.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ResultsView =
/*#__PURE__*/
function (_View) {
  _inherits(ResultsView, _View);

  var _super = _createSuper(ResultsView);

  function ResultsView() {
    var _this;

    _classCallCheck(this, ResultsView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.results'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'No recipe found for your query!!!.');

    return _this;
  }

  _createClass(ResultsView, [{
    key: "_generateMarkup",
    value: function _generateMarkup() {
      return this._data.map(function (result) {
        return _previewView.default.render(result, false);
      }).join('');
    }
  }]);

  return ResultsView;
}(_view.default);

var _default = new ResultsView();

exports.default = _default;
},{"./view.js":"src/js/views/view.js","../../img/icons.svg":"src/img/icons.svg","./previewView.js":"src/js/views/previewView.js"}],"src/js/views/paginationView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("./view.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PaginationView =
/*#__PURE__*/
function (_View) {
  _inherits(PaginationView, _View);

  var _super = _createSuper(PaginationView);

  function PaginationView() {
    var _this;

    _classCallCheck(this, PaginationView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.pagination'));

    return _this;
  }

  _createClass(PaginationView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn--inline');
        if (!btn) return;
        var goToPage = btn.dataset.goto;
        handler(+goToPage);
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
      var curPage = this._data.page; //page 1, and there are other pages

      if (curPage === 1 && numPages > 1) return this._generateMarkupBtn('next', curPage); //last page

      if (curPage === numPages && numPages > 1) return this._generateMarkupBtn('prev', curPage); //other page

      if (curPage < numPages) return "".concat(this._generateMarkupBtn('prev', curPage), " ").concat(this._generateMarkupBtn('next', curPage)); //page 1, and ther are not other pages

      return '';
    }
  }, {
    key: "_generateMarkupBtn",
    value: function _generateMarkupBtn(type, curPage) {
      if (type === 'next') return "\n\t\t\t\t<button class=\"btn--inline pagination__btn--next\" data-goto=".concat(curPage + 1, ">\n\t\t\t\t\t<span>Page ").concat(curPage + 1, "</span>\n\t\t\t\t\t<svg class=\"search__icon\">\n\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-arrow-right\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t</button>\n\t\t\t");
      if (type === 'prev') return "\n\t\t\t\t<button class=\"btn--inline pagination__btn--prev\" data-goto=".concat(curPage - 1, ">\n\t\t\t\t\t<svg class=\"search__icon\">\n\t\t\t\t\t\t<use href=\"").concat(_icons.default, "#icon-arrow-left\"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span>Page ").concat(curPage - 1, "</span>\n\t\t\t\t</button>\n\t\t\t");
    }
  }]);

  return PaginationView;
}(_view.default);

var _default = new PaginationView();

exports.default = _default;
},{"./view.js":"src/js/views/view.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/views/bookmarksView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("./view.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

var _previewView = _interopRequireDefault(require("./previewView.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BookmarksView =
/*#__PURE__*/
function (_View) {
  _inherits(BookmarksView, _View);

  var _super = _createSuper(BookmarksView);

  function BookmarksView() {
    var _this;

    _classCallCheck(this, BookmarksView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.bookmarks__list'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'No bookmarks yet. Find a nice recipe and bookmark it :)');

    return _this;
  }

  _createClass(BookmarksView, [{
    key: "addHandlerRender",
    value: function addHandlerRender(handler) {
      window.addEventListener('load', handler);
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      console.log(this._data);
      return this._data.map(function (bookmark) {
        return _previewView.default.render(bookmark, false);
      }).join('');
    }
  }]);

  return BookmarksView;
}(_view.default);

var _default = new BookmarksView();

exports.default = _default;
},{"./view.js":"src/js/views/view.js","../../img/icons.svg":"src/img/icons.svg","./previewView.js":"src/js/views/previewView.js"}],"src/js/views/addRecipeView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("./view.js"));

var _icons = _interopRequireDefault(require("../../img/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AddRecipeView =
/*#__PURE__*/
function (_View) {
  _inherits(AddRecipeView, _View);

  var _super = _createSuper(AddRecipeView);

  function AddRecipeView() {
    var _this;

    _classCallCheck(this, AddRecipeView);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.upload'));

    _defineProperty(_assertThisInitialized(_this), "_window", document.querySelector('.add-recipe-window'));

    _defineProperty(_assertThisInitialized(_this), "_overlay", document.querySelector('.overlay'));

    _defineProperty(_assertThisInitialized(_this), "_btnOpen", document.querySelector('.nav__btn--add-recipe'));

    _defineProperty(_assertThisInitialized(_this), "_btnClose", document.querySelector('.btn--close-modal'));

    _defineProperty(_assertThisInitialized(_this), "_message", 'Recipe was successfully uploaded  :)');

    _this._addHandlerShowWindow();

    _this._addHandlerCloseWindow();

    return _this;
  }

  _createClass(AddRecipeView, [{
    key: "toggleWindow",
    value: function toggleWindow() {
      this._overlay.classList.toggle('hidden');

      this._window.classList.toggle('hidden');
    }
  }, {
    key: "_addHandlerShowWindow",
    value: function _addHandlerShowWindow() {
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
  }, {
    key: "_addHandlerCloseWindow",
    value: function _addHandlerCloseWindow() {
      this._btnClose.addEventListener('click', this.toggleWindow.bind(this));

      this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }
  }, {
    key: "addHandlerUpload",
    value: function addHandlerUpload(handler) {
      this._parentElement.addEventListener('submit', function (e) {
        e.preventDefault();

        var dataArr = _toConsumableArray(new FormData(this));

        var data = Object.fromEntries(dataArr);
        handler(data);
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {}
  }]);

  return AddRecipeView;
}(_view.default);

var _default = new AddRecipeView();

exports.default = _default;
},{"./view.js":"src/js/views/view.js","../../img/icons.svg":"src/img/icons.svg"}],"src/js/controller.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _config = require("./config.js");

var model = _interopRequireWildcard(require("./model.js"));

var _recipeView = _interopRequireDefault(require("./views/recipeView.js"));

var _searchView = _interopRequireDefault(require("./views/searchView.js"));

var _resultsView = _interopRequireDefault(require("./views/resultsView.js"));

var _paginationView = _interopRequireDefault(require("./views/paginationView.js"));

var _bookmarksView = _interopRequireDefault(require("./views/bookmarksView.js"));

var _addRecipeView = _interopRequireDefault(require("./views/addRecipeView.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* ================================ */

/* CONTROL RECIPES
/* ================================ */
var controlRecipes =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var id;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            id = window.location.hash.slice(1);

            if (id) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            // RENDER SPINNER
            _recipeView.default.renderSpinner(); // UPDATE RESULTS VIEW TO MARK SELECTED SEARCH RESULT


            _resultsView.default.update(model.getSearchResultsPage()); // LOAD RECIPE


            _context.next = 8;
            return model.loadRecipe(id);

          case 8:
            // RENDER RECIPE
            _recipeView.default.render(model.state.recipe); // UPDATING BOOKMARK VIEW


            _bookmarksView.default.update(model.state.bookmarks);

            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);

            _recipeView.default.renderError();

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function controlRecipes() {
    return _ref.apply(this, arguments);
  };
}();
/* ================================ */

/* CONTROL SEARCHING RESULTS
/* ================================ */


var controlSearchResults =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var query;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            // RENDER SPINNER
            _resultsView.default.renderSpinner(); // GETTING SEARCH QUERY


            query = _searchView.default.getQuery();

            if (query) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return");

          case 5:
            _context2.next = 7;
            return model.loadSearchResults(query);

          case 7:
            // RENDERING SEARCH RESULTS
            _resultsView.default.render(model.getSearchResultsPage()); // RENDERING INITIAL PAGINATION BUTTONS


            _paginationView.default.render(model.state.search);

            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0.message);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 11]]);
  }));

  return function controlSearchResults() {
    return _ref2.apply(this, arguments);
  };
}();
/* ================================ */

/* CONTROL PAGINATION
/* ================================ */


var controlPagination = function controlPagination(goToPage) {
  // RENDER NEW RESULTS
  _resultsView.default.render(model.getSearchResultsPage(goToPage)); // RENDER NEW PAGINATION BUTTON


  _paginationView.default.render(model.state.search);
};
/* ================================ */

/* CONTROL SERVINGS
/* ================================ */


var controlServings = function controlServings(newServings) {
  // UPDATE THE RECIPE SERVINGS (IN STATE)
  model.updateServings(newServings); // UPDATE THE RECIPE VIEW
  // recipeView.render(model.state.recipe);

  _recipeView.default.update(model.state.recipe);
};
/* ================================ */

/* CONTROL ADD BOOKMARK
/* ================================ */


var controlAddBookmark = function controlAddBookmark() {
  // ADD OR REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);else model.deleteBookmark(model.state.recipe.id); // UPDATE RECIPE VIEW

  _recipeView.default.update(model.state.recipe); // RENDER BOOKMARKS


  _bookmarksView.default.render(model.state.bookmarks);
};
/* ================================ */

/* CONTROL BOOKMARK
/* ================================ */


var controlBookmarks = function controlBookmarks() {
  _bookmarksView.default.render(model.state.bookmarks);
};
/* ================================ */

/* CONTROL ADD RECIPES
/* ================================ */


var controlAddRecipe =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(newRecipe) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            // SHOW LOADING SPINNER;
            _addRecipeView.default.renderSpinner(); // UPLOAD NEW RECIPE DATA


            _context3.next = 4;
            return model.uploadRecipe(newRecipe);

          case 4:
            console.log(model.state.recipe); // RENDER RECIPE

            _recipeView.default.render(model.state.recipe); // SUCCESS MESSAGE


            _addRecipeView.default.renderMessage(); // RENDER BOOKMARK VIEW


            _bookmarksView.default.render(model.state.bookmarks); // CHANGE ID OF THE URL


            window.history.pushState(null, '', "#".concat(model.state.recipe.id)); // CLOSE FORM WINDOW

            setTimeout(function () {
              _addRecipeView.default.toggleWindow();
            }, _config.MODAL_CLOSE_SEC * 1000);
            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            console.error("".concat(_context3.t0.message));

            _addRecipeView.default.renderError(_context3.t0.message);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 12]]);
  }));

  return function controlAddRecipe(_x) {
    return _ref3.apply(this, arguments);
  };
}();
/* ================================ */

/* PUBLISHER-SUBSCRIBER MODEL
/* ================================ */


var init = function init() {
  _bookmarksView.default.addHandlerRender(controlBookmarks);

  _recipeView.default.addHandlerRender(controlRecipes);

  _recipeView.default.addHandlerUpdateServings(controlServings);

  _searchView.default.addHandlerSearch(controlSearchResults);

  _paginationView.default.addHandlerClick(controlPagination);

  _recipeView.default.addHandlerAddBookmark(controlAddBookmark);

  _addRecipeView.default.addHandlerUpload(controlAddRecipe);
};

init();
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./config.js":"src/js/config.js","./model.js":"src/js/model.js","./views/recipeView.js":"src/js/views/recipeView.js","./views/searchView.js":"src/js/views/searchView.js","./views/resultsView.js":"src/js/views/resultsView.js","./views/paginationView.js":"src/js/views/paginationView.js","./views/bookmarksView.js":"src/js/views/bookmarksView.js","./views/addRecipeView.js":"src/js/views/addRecipeView.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49608" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/js/controller.js"], null)
//# sourceMappingURL=/controller.e87f5190.js.map