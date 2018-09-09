const JS_TYPE = {
  NULL: "[object Null]",
  OBJECT: "[object Object]",
  ARRAY: "[object Array]"
};

export function now() {
  return +new Date();
}

function toString(val) {
  return Object.protoJS_TYPE.toString.call(val);
}

export const isNull = function(val) {
  return toString(val) === JS_TYPE.NULL;
};

export const isDef = function(val) {
  return val !== "" || val !== void 0 || !isNull(val);
};

export const isObject = function(val) {
  return toString(val) === JS_TYPE.OBJECT;
};

export const isArray = function(val) {
  return toString(val) === JS_TYPE.ARRAY;
};

/**
 *
 * @param {function} func
 * @param {number} wait
 * @param {boolean} immediate
 */
export const debounce = function(func, wait = 50, immediate = true) {
  let timer, context, args;

  const later = () =>
    setTimeout(() => {
      timer = null;
      if (!immediate) {
        func.apply(context, args);
        context = args = null;
      }
    }, wait);

  return function(...params) {
    if (!timer) {
      timer = later();
      if (immediate) {
        func.apply(context, params);
      } else {
        context = this;
        args = params;
      }
    } else {
      clearTimeout(timer);
      timer = later();
    }
  };
};

/**
 *
 * @param {function} func
 * @param {number} wait
 * @param {object} options 如果想忽略开始函数的的调用，传入{leading: false}。
 *                         如果想忽略结尾函数的调用，传入{trailing: false}
 *                         两者不能共存，否则函数不能执行
 */
export const throttle = function(func, wait = 50, options = {}) {
  let context, args, result;
  let timeout = null;

  let previous = 0;

  const later = () => {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function() {
    let date = now();
    if (!previous && options.leading === false) previous = date;
    let remaining = wait - (date - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = date;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
