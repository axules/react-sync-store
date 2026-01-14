"use strict";

exports.__esModule = true;
exports.ReactExternalStore = void 0;
exports.defaultLogger = defaultLogger;
var _react = require("react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
let mutate = null;
(function () {
  Promise.resolve().then(() => _interopRequireWildcard(require('deep-mutation'))).then(fn => {
    mutate = fn.default;
  }).catch(() => null);
})();

// https://react.dev/reference/react/useSyncExternalStore

function defaultLogger(title) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  // eslint-disable-next-line no-console
  console.debug("ReactExternalStore -> " + title, ...args);
}
class ReactExternalStore {
  /**
   * Contains current state
   *
   * @returns {*}
   */
  get state() {
    return this.__state__;
  }
  set state(value) {
    this.setState(value);
  }

  /**
   * Creates new storage
   *
   * @param {*} initState Any value, but expected to be `object` in the most cases.
   */
  constructor(initState) {
    this.__logger = () => null;
    this.__listeners__ = [];
    this.__state__ = undefined;
    this.__emitChangesTrigger__ = null;
    this.__emitChanges__ = () => {
      this.__logger('__emitChanges__', this.__listeners__.length);
      this.__listeners__.forEach(listener => listener(this));
    };
    // Attempt to optimize listeners calls
    this.__emitChangesTask__ = () => {
      this.__logger('__emitChangesTask__', !!this.__emitChangesTrigger__);
      clearTimeout(this.__emitChangesTrigger__);
      // push __emitChanges__ to macro tasks JS queue
      this.__emitChangesTrigger__ = setTimeout(() => this.__emitChanges__(), 10);
    };
    this.__subscribe__ = callback => {
      this.__logger('subscribe', this.__listeners__.length + 1);
      this.__listeners__ = this.__listeners__.concat([callback]);
      return () => {
        this.__unsubscribe__(callback);
      };
    };
    this.__unsubscribe__ = callback => {
      this.__logger('unsubscribe', this.__listeners__.length - 1);
      this.__listeners__ = this.__listeners__.filter(it => it !== callback);
    };
    /**
     * Select data
     *
     * @param {function?} selector Data selector: function(state).
     * @returns {*}
     */
    this.use = selector => {
      this.__logger('use');
      // const dataGetter = useMemo(() => {
      //   this.__logger('use:useMemo:dataGetter', !!selector);
      //   return selector ? () => selector(this.getState()) : this.getState;
      // }, [selector]);
      // https://react.dev/reference/react/useSyncExternalStore
      return (0, _react.useSyncExternalStore)(this.__subscribe__, () => selector ? selector(this.state) : this.state);
    };
    // /**
    //  * Select data
    //  *
    //  * @param {function?} selector Method data extractor. E.g. `(state) => state.connections`. If empty then returns whole state.
    //  * @param {*[]?} deps selector dependency for React.useMemo.
    //  * @returns {*}
    //  */
    // useMemoized = (selector, deps = []) => {
    //   const memoizedSelector = useMemo(() => selector, deps);
    //   return this.use(memoizedSelector);
    // };
    /**
     * `function(newState, prevState)` Handler will be triggered BEFORE set new state
     *
     * @type {function} beforeUpdate. function(newState, prevState). Returns new state.
     */
    this.beforeUpdate = undefined;
    // beforeUpdate = (nextValue, prevValue) => {
    //   return nextValue;
    // };
    /**
     * Use to set new value. Returns new state which is applied.
     *
     * @param {*|function} value Any value for your storage OR `function(state) { return {...state, anyValue: 123 }}`;
     * @returns {*}
     */
    this.setState = value => {
      this.__logger('setState:start', value);
      let preparedValue = typeof value === 'function' ? value(this.state) : value;
      if (this.state === preparedValue || Object.is(this.state, preparedValue)) {
        return this.state;
      }
      if (this.beforeUpdate) {
        preparedValue = this.beforeUpdate(preparedValue, this.state);
        this.__logger('setState:beforeUpdate', preparedValue);
      }
      if (this.state === preparedValue || Object.is(this.state, preparedValue)) {
        this.__logger('setState:update', 'State is not changed');
        return this.state;
      }
      this.__logger('setState:update', preparedValue);
      this.__state__ = preparedValue;
      this.__emitChangesTask__();
      return this.state;
    };
    /**
     * It patches current value by using `deep-mutation` library.
     *
     * @param {object|array?} patch Specifies path and value for patching. It could be `Array(Array(key, value))` or `Object(key, value)`.
     * @returns new patched value
     * @example
     * MyStorage.getValue();
     * // { a: 1, b: 2, c: [11,22], e: { e1: 'val' }}
     * MyStorage.patchValue({ d: 99, 'c[]': 33, 'e.e2': 'val2' });
     * //OR MyStorage.patchValue([ ['d', 99], ['c[]', 33], ['e.e2', 'val2'] ]);
     * // { a: 1, b: 2, c: [11,22,33], d: 99, e: { e1: 'val', e2: 'val2' }}
     */
    this.patchState = patch => {
      if (!mutate) throw new Error('To use this you need to install "deep-mutation"');
      return this.setState(mutate(this.state, patch));
    };
    /**
     * Deep merges current value and new object by using `deep-mutation` library.
     *
     * @param {object?} patch Deep patch value.
     * @returns new patched value
     * @example
     * MyStorage.getValue();
     * // { a: 1, b: 2, c: [11,22], e: { e1: 'val' }}
     * MyStorage.patchValue({ d: 99, c: [33], e: {e2: 'val2'} });
     * // { a: 1, b: 2, c: [11,22,33], d: 99, e: { e1: 'val', e2: 'val2' }}
     */
    this.mergeState = patch => {
      if (!mutate) throw new Error('To use this you need to install "deep-mutation"');
      return this.setState(mutate.deep(this.state, patch));
    };
    this.__state__ = initState;
    this.__logger('constructor', initState);
  }
}
exports.ReactExternalStore = ReactExternalStore;