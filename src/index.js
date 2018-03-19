/*
 * TODO: JSDOC, JEST, add other used pieces of code here
 */

const func = promise => {
  return promise.then(res => [undefined, res]).catch(err => [err, undefined])
}


/*
 * TODO: Improve the idea of a catch combinator
 */
const translateError = msg => {
  const newErr = new Error(msg)
  return oldErr => {
    newErr.oldError = oldErr
    throw newError
  }
}


// Support commonJS, AMD, etc. for npmjs
