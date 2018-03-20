/**
 * Check if the promise is of Promise type
 * @param {*} promise
 * @return {boolean}
 */
const _isPromise = promise => {
  return promise && typeof promise.then === 'function'
}

/**
 * Checks if obj is a function, curtosy of underscorejs.
 * @param {*} obj
 * @return {boolean}
 */
const _isFunction = obj => {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}

/**
 * Returns the [res, err] of an async function
 * Normal data and sync functions are allowed to be passed through
 * @param {*} promise
 * @returns {Promise} Promise object represents [res, err]
 */
const func = promise => {
  if (_isFunction(promise)) {
    try {
      return func(promise())
    } catch (err) {
      return [undefined, err]
    }
  }
  if (!_isPromise(promise)) {
    return [promise, undefined]
  }

  return promise.then(res => [res, undefined]).catch(err => [undefined, err])
}

/**
 * Transforms an Error with a readable msg.
 * @param {string} msg
 * @return {trErr~inner} an err transform function
 */
const trErr = msg => {
  /**
   * Constructs new error
   * @param {object} a standard error
   * @throws {object} a standard error `error:${msg}\n- original error:${err}`
   */
  return err => {
    throw new Error(`error: ${msg}\n- original error: ${err}`)
  }
}

module.exports = { func, trErr }
