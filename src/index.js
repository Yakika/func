/**
 * Check if the promise is of Promise type
 * @param {*} promise
 * @returns {boolean} true if is a promise
 */
const _isPromise = promise => {
  return promise && typeof promise.then === 'function'
}

/**
 * Transforms the error
 * @param {object} err
 * @param {string} msg
 * @returns a new Error with message `error: ${msg}\n- original error: ${err}`
 */
const _transformErrorMsg = (err, msg) => {
  return new Error(`error: ${msg}\n- original error: ${err}`)
}

/**
 * Returns the [res, err] of an async function
 * Normal data and sync functions are allowed to be passed through
 * @param {Promise|*} promise
 * @param {string} [msg]
 * @returns {Promise} Promise object represents [res, err]
 */
const func = (promise, msg) => {
  // we allow data to be passed through
  if (!_isPromise(promise)) {
    return [promise, undefined]
  }
  return promise.then(res => [res, undefined]).catch(err => {
    err = msg === undefined ? err : _transformErrorMsg(err, msg)
    return [undefined, err]
  })
}

/**
 * Transforms an Error with a readable msg.
 * @param {string} msg
 * @returns {trErr~trfn} an err transform function
 */
const trErr = msg => {
  /**
   * @function trfn
   * @param {object} a standard error
   * @throws {object} a standard error `error:${msg}\n- original error:${err}`
   */
  const trfn = err => {
    throw _transformErrorMsg(err, msg)
  }
  return trfn
}

module.exports = { func, trErr }

// For better ES module compatibility
module.exports.default = func
